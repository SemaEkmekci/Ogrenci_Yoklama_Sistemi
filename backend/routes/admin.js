const express = require("express");
const router = express.Router();
const sql = require("mssql");
const db = require("../data/db");
const bcrypt = require("bcrypt");

const validateStudents = (students) => {
  students.forEach((student) => {
    // ogrenci_no kontrolü
    if (!student.ogrenci_no) {
      throw new Error(`ogrenci_no sütununda boş veri var.`);
    } else if (typeof student.ogrenci_no !== "string") {
      try {
        student.ogrenci_no = String(student.ogrenci_no);
      } catch (error) {
        throw new Error(
          `ogrenci_no sütununda veri uygun formata çevrilemiyor.`
        );
      }
    }

    // ogrenci_id kontrolü
    if (!student.ogrenci_id) {
      throw new Error(`ogrenci_id sütununda boş veri var.`);
    } else if (typeof student.ogrenci_id !== "string") {
      try {
        student.ogrenci_id = String(student.ogrenci_id);
      } catch (error) {
        throw new Error(
          `ogrenci_id sütununda veri uygun formata çevrilemiyor.`
        );
      }
    }

    // bolum_baslama_yili kontrolü
    if (
      student.bolum_baslama_yili === undefined ||
      student.bolum_baslama_yili === null
    ) {
      throw new Error(`bolum_baslama_yili sütununda boş veri var.`);
    } else if (isNaN(student.bolum_baslama_yili)) {
      try {
        student.bolum_baslama_yili = Number(student.bolum_baslama_yili);
        if (isNaN(student.bolum_baslama_yili)) {
          throw new Error();
        }
      } catch (error) {
        throw new Error(
          `bolum_baslama_yili sütununda veri uygun formata çevrilemiyor.`
        );
      }
    }

    // tek_sifre kontrolü
    if (!student.tek_sifre) {
      throw new Error(`tek_sifre sütununda boş veri var.`);
    } else if (typeof student.tek_sifre !== "string") {
      try {
        student.tek_sifre = String(student.tek_sifre);
      } catch (error) {
        throw new Error(`tek_sifre sütununda veri uygun formata çevrilemiyor.`);
      }
    }

    // ad kontrolü
    if (!student.ad) {
      throw new Error(`ad sütununda boş veri var.`);
    } else if (typeof student.ad !== "string") {
      try {
        student.ad = String(student.ad);
      } catch (error) {
        throw new Error(`ad sütununda veri uygun formata çevrilemiyor.`);
      }
    }

    // soyad kontrolü
    if (!student.soyad) {
      throw new Error(`soyad sütununda boş veri var.`);
    } else if (typeof student.soyad !== "string") {
      try {
        student.soyad = String(student.soyad);
      } catch (error) {
        throw new Error(`soyad sütununda veri uygun formata çevrilemiyor.`);
      }
    }

    // bolum kontrolü
    if (!student.bolum) {
      throw new Error(`bolum sütununda boş veri var.`);
    } else if (typeof student.bolum !== "string") {
      try {
        student.bolum = String(student.bolum);
      } catch (error) {
        throw new Error(`bolum sütununda veri uygun formata çevrilemiyor.`);
      }
    }
  });
};

router.post("/upload-data-student", async (req, res) => {
  if (req.session.no) {
    const students = req.body;
    try {
      validateStudents(students);
    } catch (error) {
      console.log("Hatalı veri");
      return res.json({ error: 242, details: error.message });
    }

    const transaction = new sql.Transaction();
    try {
      await transaction.begin();

      for (const student of students) {
        try {
          const hashedPassword = await bcrypt.hash(student.tek_sifre, 15);
          await new sql.Request(transaction)
            .input("ogrenci_no", sql.VarChar, student.ogrenci_no)
            .input("ogrenci_id", sql.VarChar, student.ogrenci_id)
            .input("tek_sifre", sql.VarChar, hashedPassword)
            .input("ad", sql.VarChar, student.ad)
            .input("soyad", sql.VarChar, student.soyad)
            .input("bolum", sql.VarChar, student.bolum)
            .input("bolum_baslama_yili", sql.Int, student.bolum_baslama_yili)
            .query(`
                        INSERT INTO ogrenci (ogrenci_no, ogrenci_id, tek_sifre, ad, soyad, bolum, bolum_baslama_yili)
                        VALUES (@ogrenci_no, @ogrenci_id, @tek_sifre, @ad, @soyad, @bolum, @bolum_baslama_yili)
                    `);
        } catch (error) {
          if (error.number === 2627 || error.code === "EREQUEST") {
            console.log(
              `Öğrenci zaten mevcut, atlanıyor: ${student.ogrenci_no}`
            );
            continue;
          } else {
            throw error;
          }
        }
      }

      await transaction.commit();
      res
        .status(200)
        .json({ valid: true, msg: "Veriler başarıyla kaydedildi." });
    } catch (error) {
      if (!transaction._aborted) {
        await transaction.rollback();
      }
      if (error.message && error.message.includes("Invalid")) {
        res.status(400).json({
          valid: true,
          error: "Hatalı veri girdiniz:",
          details: error.message,
        });
      } else {
        console.error("Veri kaydında hata oluştu:", error);
        res.status(500).json({
          valid: true,
          error: "Veri kaydında hata oluştu:",
          details: error.message,
        });
      }
    }
  } else {
    return res.json({ valid: false, message: "Session not found" });
  }
});

router.get("/students", async (req, res) => {
  if (req.session.no) {
    try {
      const pool = await db.getConnection();
      const request = pool.request();

      const query = `
                SELECT 
                    *
                FROM 
                    ogrenci
            `;
      const resultStudent = await request.query(query);

      res.json({ valid: true, students: resultStudent.recordset });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  } else {
    return res.json({ valid: false, message: "Session not found" });
  }
});

router.get("/instructor", async (req, res) => {
  if (req.session.no) {
    try {
      const pool = await db.getConnection();
      const request = pool.request();

      const query = `
                SELECT 
                   a.ad, 
                   a.soyad, 
                   a.unvan, 
                   a.bolum
                FROM 
                    akademisyen a
                WHERE 
                    a.ad != 'Yönetici' AND 
                    a.unvan != 'SuperUser';

            `;
      const resultInstructor = await request.query(query);

      res.json({ valid: true, students: resultInstructor.recordset });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  } else {
    return res.json({ valid: false, message: "Session not found" });
  }
});

router.get("/lesson", async (req, res) => {
  if (req.session.no) {
    try {
      const pool = await db.getConnection();
      const request = pool.request();

      const query = `
                SELECT 
                    d.ders_id, 
                    d.ders_adi
                FROM 
                    ders d
            `;
      const resultLesson = await request.query(query);
      console.log(resultLesson);
      res.json({ valid: true, lesson: resultLesson.recordset });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  } else {
    return res.json({ valid: false, message: "Session not found" });
  }
});

const validateInstructors = (instructors) => {
  instructors.forEach((instructor) => {
    // akademisyen_tc kontrolü
    if (!instructor.akademisyen_tc) {
      throw new Error(`akademisyen_tc sütununda boş veri var.`);
    } else if (typeof instructor.akademisyen_tc !== "string") {
      try {
        instructor.akademisyen_tc = String(instructor.akademisyen_tc);
      } catch (error) {
        throw new Error(
          `akademisyen_tc sütununda veri uygun formata çevrilemiyor.`
        );
      }
    }

    // akademisyen_id kontrolü
    if (!instructor.akademisyen_id) {
      throw new Error(`akademisyen_id sütununda boş veri var.`);
    } else if (typeof instructor.akademisyen_id !== "string") {
      try {
        instructor.akademisyen_id = String(instructor.akademisyen_id);
      } catch (error) {
        throw new Error(
          `akademisyen_id sütununda veri uygun formata çevrilemiyor.`
        );
      }
    }

    // tek_sifre kontrolü
    if (!instructor.tek_sifre) {
      throw new Error(`tek_sifre sütununda boş veri var.`);
    } else if (typeof instructor.tek_sifre !== "string") {
      try {
        instructor.tek_sifre = String(instructor.tek_sifre);
      } catch (error) {
        throw new Error(`tek_sifre sütununda veri uygun formata çevrilemiyor.`);
      }
    }

    // ad kontrolü
    if (!instructor.ad) {
      throw new Error(`ad sütununda boş veri var.`);
    } else if (typeof instructor.ad !== "string") {
      try {
        instructor.ad = String(instructor.ad);
      } catch (error) {
        throw new Error(`ad sütununda veri uygun formata çevrilemiyor.`);
      }
    }

    // soyad kontrolü
    if (!instructor.soyad) {
      throw new Error(`soyad sütununda boş veri var.`);
    } else if (typeof instructor.soyad !== "string") {
      try {
        instructor.soyad = String(instructor.soyad);
      } catch (error) {
        throw new Error(`soyad sütununda veri uygun formata çevrilemiyor.`);
      }
    }

    // unvan kontrolü
    if (!instructor.unvan) {
      throw new Error(`unvan sütununda boş veri var.`);
    } else if (typeof instructor.unvan !== "string") {
      try {
        instructor.unvan = String(instructor.unvan);
      } catch (error) {
        throw new Error(`unvan sütununda veri uygun formata çevrilemiyor.`);
      }
    }

    // bolum kontrolü
    if (!instructor.bolum) {
      throw new Error(`bolum sütununda boş veri var.`);
    } else if (typeof instructor.bolum !== "string") {
      try {
        instructor.bolum = String(instructor.bolum);
      } catch (error) {
        throw new Error(`bolum sütununda veri uygun formata çevrilemiyor.`);
      }
    }
  });
};

router.post("/upload-data-instructor", async (req, res) => {
  console.log("Hebel Hübele");
  if (req.session.no) {
    const instructors = req.body;
    try {
      validateInstructors(instructors);
    } catch (error) {
      console.log("Hatalı veri");
      return res.json({ error: 242, details: error.message });
    }

    const transaction = new sql.Transaction();
    try {
      await transaction.begin();

      for (const instructor of instructors) {
        try {
          const hashedPassword = await bcrypt.hash(instructor.tek_sifre, 15);
          await new sql.Request(transaction)
            .input("akademisyen_tc", sql.VarChar, instructor.akademisyen_tc)
            .input("akademisyen_id", sql.VarChar, instructor.akademisyen_id)
            .input("tek_sifre", sql.VarChar, hashedPassword)
            .input("ad", sql.VarChar, instructor.ad)
            .input("soyad", sql.VarChar, instructor.soyad)
            .input("unvan", sql.VarChar, instructor.unvan)
            .input("bolum", sql.VarChar, instructor.bolum).query(`
                            INSERT INTO akademisyen (akademisyen_tc, akademisyen_id, tek_sifre, ad, soyad, unvan, bolum)
                            VALUES (@akademisyen_tc, @akademisyen_id, @tek_sifre, @ad, @soyad, @unvan, @bolum)
                        `);
        } catch (error) {
          if (error.number === 2627 || error.code === "EREQUEST") {
            console.log(
              `Akademisyen zaten mevcut, atlanıyor: ${instructor.akademisyen_tc}`
            );
            continue;
          } else {
            throw error;
          }
        }
      }

      await transaction.commit();
      res
        .status(200)
        .json({ valid: true, msg: "Veriler başarıyla kaydedildi." });
    } catch (error) {
      if (!transaction._aborted) {
        await transaction.rollback();
      }
      if (error.message && error.message.includes("Invalid")) {
        res.status(400).json({
          valid: true,
          error: "Hatalı veri girdiniz:",
          details: error.message,
        });
      } else {
        console.error("Veri kaydında hata oluştu:", error);
        res.status(500).json({
          valid: true,
          error: "Veri kaydında hata oluştu:",
          details: error.message,
        });
      }
    }
  } else {
    return res.json({ valid: false, message: "Session not found" });
  }
});

const validateLessons = (lessons) => {
  lessons.forEach((lesson) => {
    // ders_id kontrolü
    if (!lesson.ders_id) {
      throw new Error(`ders_id sütununda boş veri var.`);
    } else if (typeof lesson.ders_id !== "string") {
      try {
        lesson.ders_id = String(lesson.ders_id);
      } catch (error) {
        throw new Error(`ders_id sütununda veri uygun formata çevrilemiyor.`);
      }
    }

    // ders_adi kontrolü
    if (!lesson.ders_adi) {
      throw new Error(`ders_adi sütununda boş veri var.`);
    } else if (typeof lesson.ders_adi !== "string") {
      try {
        lesson.ders_adi = String(lesson.ders_adi);
      } catch (error) {
        throw new Error(`ders_adi sütununda veri uygun formata çevrilemiyor.`);
      }
    }
  });
};

router.post("/upload-data-lesson", async (req, res) => {
  console.log("Lesson upload started");

  if (req.session.no) {
    const lessons = req.body;
    try {
      validateLessons(lessons);
    } catch (error) {
      console.log("Hatalı veri");
      return res.json({ error: 242, details: error.message });
    }

    const transaction = new sql.Transaction();
    try {
      await transaction.begin();

      for (const lesson of lessons) {
        try {
          await new sql.Request(transaction)
            .input("ders_id", sql.VarChar, lesson.ders_id)
            .input("ders_adi", sql.VarChar, lesson.ders_adi).query(`
                            INSERT INTO ders (ders_id, ders_adi)
                            VALUES (@ders_id, @ders_adi)
                        `);
        } catch (error) {
          if (error.number === 2627 || error.code === "EREQUEST") {
            console.log(`Ders zaten mevcut, atlanıyor: ${lesson.ders_id}`);
            continue;
          } else {
            throw error;
          }
        }
      }

      await transaction.commit();
      res
        .status(200)
        .json({ valid: true, msg: "Veriler başarıyla kaydedildi." });
    } catch (error) {
      if (!transaction._aborted) {
        await transaction.rollback();
      }
      if (error.message && error.message.includes("Invalid")) {
        res.status(400).json({
          valid: true,
          error: "Hatalı veri girdiniz:",
          details: error.message,
        });
      } else {
        console.error("Veri kaydında hata oluştu:", error);
        res.status(500).json({
          valid: true,
          error: "Veri kaydında hata oluştu:",
          details: error.message,
        });
      }
    }
  } else {
    return res.json({ valid: false, message: "Session not found" });
  }
});

router.put("/update-student", async (req, res) => {
  if (req.session.no) {
    const student = req.body;
    console.log(student);
    try {
      validateStudents([student]);
    } catch (error) {
      console.log("Hatalı veri:", error);
      return res.status(400).json({ error: 242, details: error.message });
    }

    let transaction;
    try {
      const pool = await db.getConnection();
      transaction = new sql.Transaction(pool);
      await transaction.begin();

      const hashedPassword = await bcrypt.hash(student.tek_sifre, 15);

      const request = new sql.Request(transaction);
      request.queryTimeout = 30000; // 30 saniye timeout
      console.log(student.oldStudentNumber);

      await request
        .input("old_ogrenci_no", sql.VarChar, student.oldStudentNumber)
        .input("ogrenci_no", sql.VarChar, student.ogrenci_no)
        .input("ogrenci_id", sql.VarChar, student.ogrenci_id)
        .input("tek_sifre", sql.VarChar, hashedPassword)
        .input("ad", sql.VarChar, student.ad)
        .input("soyad", sql.VarChar, student.soyad)
        .input("bolum", sql.VarChar, student.bolum)
        .input("bolum_baslama_yili", sql.Int, student.bolum_baslama_yili)
        .query(`
          UPDATE ogrenci
          SET ogrenci_no = @ogrenci_no,
              ogrenci_id = @ogrenci_id,
              tek_sifre = @tek_sifre,
              ad = @ad,
              soyad = @soyad,
              bolum = @bolum,
              bolum_baslama_yili = @bolum_baslama_yili
          WHERE ogrenci_no = @old_ogrenci_no
        `);
      await transaction.commit();
      res
        .status(200)
        .json({ valid: true, msg: "Öğrenci bilgileri başarıyla güncellendi." });
    } catch (error) {
      if (transaction && !transaction._aborted) {
        await transaction.rollback();
      }
      console.error("Veri güncelleme hatası:", error);
      res.status(500).json({
        valid: false,
        error: "Veri güncelleme hatası:",
        details: error.message,
      });
    }
  } else {
    return res.status(401).json({ valid: false, message: "Session not found" });
  }
});

module.exports = router;
