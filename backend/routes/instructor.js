const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const db = require("../data/db");
const router = express.Router();

router.get("/info", async (req, res) => {
  if (req.session.no) {
    const pool = await db.getConnection();
    const request = pool.request();
    request.input("userID", sql.VarChar, req.session.no);
    const result = await request.query(
      "SELECT ad, soyad, unvan, bolum FROM akademisyen WHERE akademisyen_id = @userID"
    );
    console.log("AAAA");
    console.log(result);
    if (result.recordset.length === 1) {
      const { ad, soyad, unvan, bolum } = result.recordset[0];
      res.status(200).json({ valid: true, ad, soyad, unvan, bolum });
    } else {
      res.status(404).json({ valid: false, message: "Kullanıcı bulunamadı" });
    }
  } else {
    return res.json({ valid: false, message: "Oturum bulunamadı" });
  }
});

router.get("/students", async (req, res) => {
  if (req.session.no) {
    try {
      const pool = await db.getConnection();
      const request = pool.request();
      request.input("userID", sql.VarChar, req.session.no);

      const result = await request.query(
        "SELECT ders_id FROM ders_programi WHERE akademisyen_id = @userID"
      );
      console.log(result);

      const dersIDs = result.recordset.map((row) => row.ders_id);

      const query = `
            SELECT 
            o.ogrenci_no, 
            o.ad, 
            o.soyad, 
            o.bolum, 
            d.ders_id, 
            d.ders_adi,
            COUNT(dev.devamsizlik_id) AS toplam_devamsizlik
        FROM 
            ogrenci o
        INNER JOIN 
            ogrenci_ders od ON o.ogrenci_id = od.ogrenci_id
        INNER JOIN 
            ders_programi dp ON od.ders_id = dp.ders_id
        INNER JOIN 
            ders d ON dp.ders_id = d.ders_id
        LEFT JOIN 
            devamsizlik dev ON o.ogrenci_no = dev.ogrenci_no AND d.ders_id = dev.ders_id
        WHERE 
            dp.ders_id IN (${dersIDs
              .map((_, index) => `@dersID${index}`)
              .join(", ")})
        GROUP BY 
            o.ogrenci_no, 
            o.ad, 
            o.soyad, 
            o.bolum, 
            d.ders_id, 
            d.ders_adi;        
                `;

      dersIDs.forEach((dersID, index) => {
        request.input(`dersID${index}`, sql.VarChar, dersID);
      });

      const resultStudent = await request.query(query);
      console.log(resultStudent);

      res.json({ success: true, students: resultStudent.recordset });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  } else {
    return res.json({ valid: false, message: "Session not found" });
  }
});

router.get("/lessonInstructor", async (req, res) => {
  if (req.session.no) {
    try {
      const pool = await db.getConnection();
      const request = pool.request();
      request.input("userID", sql.VarChar, req.session.no);

      const query = `
                SELECT b.bolum_adi, d.ders_adi 
                FROM ders_programi dp
                INNER JOIN bolum b ON dp.bolum_id = b.bolum_id
                INNER JOIN ders d ON dp.ders_id = d.ders_id
                WHERE dp.akademisyen_id = @userID
            `;

      const result = await request.query(query);

      if (result.recordset.length > 0) {
        res.status(200).json({ valid: true, lessons: result.recordset });
      } else {
        res
          .status(404)
          .json({
            valid: false,
            message: "Akademisyenin verdiği ders bulunamadı",
          });
      }
    } catch (error) {
      console.error("Error: ", error);
      res
        .status(500)
        .json({ valid: false, message: "Sunucuda bir hata oluştu" });
    }
  } else {
    res.json({ valid: false, message: "Oturum bulunamadı" });
  }
});

router.get("/currentLessonAttendance", async (req, res) => {
  try {
    const currentDate = new Date();
    const options = { timeZone: "Europe/Istanbul" };
    const currentLocaleDate = currentDate.toLocaleDateString("tr-TR", options);
    console.log("Şu anki tarih:", currentLocaleDate);

    const currentTime =
      currentDate.getHours().toString().padStart(2, "0") +
      ":" +
      currentDate.getMinutes().toString().padStart(2, "0") +
      ":" +
      currentDate.getSeconds().toString().padStart(2, "0");
    const currentDay = currentDate.getDay();
    console.log("Bugünün günü:", currentDay);

    console.log(currentTime);

    const pool = await db.getConnection();
    const request = pool.request();

    console.log(currentDay);
    request.input("userID", sql.VarChar, req.session.no);
    request.input("currentTime", sql.VarChar, currentTime);
    request.input("currentDay", sql.VarChar, currentDay.toString());
    request.input("currentDate", sql.VarChar, currentLocaleDate);

    const lessonResult = await request.query(`
        SELECT dp.*, d.ders_adi FROM ders_programi dp
        INNER JOIN ders d ON dp.ders_id = d.ders_id
        WHERE ders_gunu = @currentDay 
        AND baslangic_saati <= @currentTime 
        AND bitis_saati >= @currentTime
        AND akademisyen_id = @userID
        `);

    if (lessonResult.recordset.length === 1) {
      const baslangicSaati = lessonResult.recordset[0].baslangic_saati;
      baslangicSaati.setHours(baslangicSaati.getHours() - 2);
      const formattedBaslangicSaati = baslangicSaati.toLocaleTimeString(
        "tr-TR",
        { hour: "2-digit", minute: "2-digit" }
      );

      const bitisSaati = lessonResult.recordset[0].bitis_saati;
      bitisSaati.setHours(bitisSaati.getHours() - 2);
      const formattedBitisSaati = bitisSaati.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      console.log(lessonResult);
      const result = await request.query(`
            SELECT yl.*, d.ders_adi 
            FROM yoklama_listeleri yl 
            INNER JOIN ders_programi dp ON yl.ders_id = dp.ders_id 
            INNER JOIN ders d ON dp.ders_id = d.ders_id 
            WHERE yl.yoklama_tarihi = @currentDate 
            AND dp.ders_gunu = @currentDay 
            AND dp.baslangic_saati <= @currentTime 
            AND dp.bitis_saati >= @currentTime
            `);

      if (result.recordset.length > 0) {
        const studentNumbers = result.recordset.map((row) => row.ogrenci_no);

        const query = `
                SELECT o.ogrenci_no, o.ad, o.soyad, o.bolum
                FROM ogrenci o WHERE o.ogrenci_no IN (${studentNumbers
                  .map((_, index) => `@studentNumber${index}`)
                  .join(", ")})
            `;

        studentNumbers.forEach((studentNumber, index) => {
          request.input(`studentNumber${index}`, sql.VarChar, studentNumber);
        });

        const resultStudent = await request.query(query);
        console.log(resultStudent);

        let responseInfo = {
          valid: true,
          students: resultStudent.recordset.map((student, index) => ({
            ogrenci_no: student.ogrenci_no,
            ad: student.ad,
            soyad: student.soyad,
            bolum: student.bolum,
            derse_giris_saati: result.recordset[index].derse_giris_saati,
          })),
          lesson: {
            ders_adi: result.recordset[0].ders_adi,
            ders_saati: formattedBaslangicSaati + "-" + formattedBitisSaati,
          },
        };

        console.log(responseInfo);

        // res.status(200).json({ valid: true, students : resultStudent.recordset , lesson: result.recordset[0].ders_adi});
        res.json(responseInfo);
      } else {
        res.json({
          valid: true,
          state: "no_student",
          message: "Derste Öğrenci Yok",
          lesson: {
            ders_adi: lessonResult.recordset[0].ders_adi,
            ders_saati: formattedBaslangicSaati + "-" + formattedBitisSaati,
          },
        });
      }
    } else {
      res.json({ valid: true, state: "no_lesson" ,message: "Şu An Ders Yok" });
    }
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    res.status(500).send("Error retrieving attendance");
  }
});

router.post("/attendanceDate", async (req, res) => {
  const { lessonName } = req.body;
  console.log("LESSON NAME", lessonName);
  const pool = await db.getConnection();
  const request = pool.request();
  request.input("lessonName", sql.VarChar, lessonName);
  const result = await request.query(
    "SELECT yoklama_tarihi FROM yoklama_listeleri WHERE ders_id = (SELECT d.ders_id FROM ders d WHERE d.ders_adi = @lessonName)"
  );

  const uniqueDates = new Set();
  result.recordset.forEach((record) => {
    uniqueDates.add(record.yoklama_tarihi);
  });

  const uniqueDatesArray = Array.from(uniqueDates);
  return res.json({ message: "success", dates: uniqueDatesArray });
});

router.post("/attendanceList", async (req, res) => {
  const { lessonName, selectedDate } = req.body;
  console.log(lessonName);
  const pool = await db.getConnection();
  const request = pool.request();
  request.input("userID", sql.VarChar, req.session.no);
  request.input("lessonName", sql.VarChar, lessonName);
  request.input("selectedDate", sql.VarChar, selectedDate);

  const query = `
                SELECT yl.yoklama_tarihi, yl.ogrenci_no, o.ad, o.soyad, yl.derse_giris_saati, yl.dersten_cikis_saati from yoklama_listeleri yl
                inner join ogrenci o on yl.ogrenci_no = o.ogrenci_no  
                where yl.ders_id = (
                select d.ders_id
                FROM ders d
                WHERE d.ders_adi = @lessonName) AND yl.yoklama_tarihi = @selectedDate
            `;

  const result = await request.query(query);

  console.log(result);
  return res.json({ message: "success", attendanceList: result.recordset });
});

router.post("/login", async (req, res) => {
  console.log("hebele hübele");
  const { userName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 15);
  console.log(hashedPassword);
  console.log(userName, password);
  try {
    const pool = await db.getConnection();
    const request = pool.request();
    request.input("userName", sql.VarChar, userName);
    // request.input('password', sql.VarChar, password);
    const result = await request.query(
      "SELECT * FROM akademisyen WHERE akademisyen_tc = @userName"
    );

    if (result.recordset.length === 1) {
      const { akademisyen_id, tek_sifre, unvan } = result.recordset[0];
      const passwordMatch = await bcrypt.compare(password, tek_sifre);

      if (passwordMatch) {
        req.session.no = akademisyen_id;
        console.log(req.session);
        res.send({
          success: true,
          message: "Başarılı giriş",
          no: req.session.no,
          degree: unvan
        });
      } else {
        res.json({ success: false, message: "Şifre hatalı" });
      }
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Giriş hatası:", error);
    // res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session bilgileri silinemedi:", err);
      return res.status(500).send("Session bilgileri silinemedi");
    }
    res.send({ success: true, message: "Başarılı çıkış" });
  });
});

module.exports = router;
