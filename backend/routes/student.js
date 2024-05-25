const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const db = require("../data/db");
const router = express.Router();

router.get('/info', async (req, res) => {
    if(req.session.no){
        const pool = await db.getConnection();
        const request = pool.request();
        request.input('student_no', sql.VarChar, req.session.no);
        const result = await request.query('SELECT ogrenci_no, ad, soyad, bolum, bolum_baslama_yili FROM ogrenci WHERE ogrenci_id = @student_no');
        if (result.recordset.length === 1) {
            const { ogrenci_no, ad, soyad, bolum, bolum_baslama_yili } = result.recordset[0];
            res.status(200).json({ valid: true, ogrenci_no, ad, soyad, bolum, bolum_baslama_yili });
            } else {
            res.status(404).json({ valid:false, message: "Kullanıcı bulunamadı" });
            }
    }
    else{
        return res.json({valid:false, message: "Oturum bulunamadı"})
    }
});


router.get('/lesson', async (req, res) => 
{

    if (req.session.no) {
   

        try {
            const pool = await db.getConnection();
            const request = pool.request();
            request.input('userID', sql.VarChar, req.session.no);
            
            const query = `
    SELECT d.ders_adi, b.bolum_adi
    FROM ogrenci_ders od
    INNER JOIN bolum b ON od.bolum_id = b.bolum_id
    INNER JOIN ogrenci o ON od.ogrenci_id = o.ogrenci_id
    INNER JOIN ders d ON od.ders_id = d.ders_id
    INNER JOIN ders_programi dp ON od.ders_id = dp.ders_id AND od.bolum_id = dp.bolum_id
    WHERE o.ogrenci_id = @userID;
`;

            
            const result = await request.query(query);
           console.log(result);
            if (result.recordset.length > 0) {
                res.status(200).json({ valid: true, lessons: result.recordset });
            } else {
                res.status(404).json({ valid: false, message: "Öğrencinin aldığı ders bulunamadı" });
            }
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ valid: false, message: "Sunucuda bir hata oluştu" });
        }
    } else {
        res.json({ valid: false, message: "Oturum bulunamadı" });
    }

});

router.post("/login", async (req, res) => {
    console.log("hebele hübele");
    const { studentNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,15);
    console.log(hashedPassword);
    try {
        const pool = await db.getConnection();
        const request = pool.request();
        request.input('studentNumber', sql.VarChar, studentNumber);
        const result = await request.query('SELECT * FROM ogrenci WHERE ogrenci_no = @studentNumber');     
        if (result.recordset.length === 1) {
            const { ogrenci_id, tek_sifre } = result.recordset[0];
            const passwordMatch = await bcrypt.compare(password, tek_sifre);
            if (passwordMatch) {
                req.session.no = ogrenci_id;
                console.log(req.session);
                // res.status(200).json({ success: true, message: "Başarılı giriş" });
                res.send({ success: true, message: "Başarılı giriş", no: req.session.no  })
                // res.status(200).json({ success: true, message: "Başarılı giriş" })
                // res.status(200).json({ success: true, message: "Başarılı giriş" }).send('Session set');


            } else {
                res.json({ success: false, message: "Şifre hatalı" });
            }
        } else {
            res.json({ success: false, message: "Öğrenci no hatalı" });
        }
    } 
    catch (error) {
        console.error("Giriş hatası:", error);
        // res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
});

router.post('/absenceList', async (req, res) => {
    console.log("hebele hübele");
    const { lessonName } = req.body;
    console.log(lessonName);
    const pool = await db.getConnection();
    const request = pool.request();
    request.input('userID', sql.VarChar, req.session.no);
    request.input('lessonName', sql.VarChar, lessonName);
    const query = `
    SELECT 
    d.tarih AS devamsizlik_tarihi,
    CONVERT(VARCHAR, dp.baslangic_saati, 108) AS ders_baslangic,
    CONVERT(VARCHAR, dp.bitis_saati, 108) AS ders_bitis
    FROM 
    devamsizlik d
    INNER JOIN 
    ders_programi dp ON d.ders_id = dp.ders_id
    WHERE 
    d.ogrenci_no = (SELECT ogrenci_no FROM ogrenci WHERE ogrenci_id = @userID)
    AND d.ders_id = (
        SELECT d.ders_id
        FROM ders d
        WHERE d.ders_adi = @lessonName
    );

    `;

    try {
        const result = await request.query(query);
        console.log(result);
        return res.json({ message: "success", attendanceList: result.recordset });
    } catch (error) {
        console.error('Failed to get attendance list:', error);
        return res.status(500).json({ message: "error" });
    }
});


    
module.exports = router;