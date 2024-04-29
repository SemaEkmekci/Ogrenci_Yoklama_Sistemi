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
        const result = await request.query('SELECT ogrenci_no, ad, soyad, bolum, bolum_baslama_yili FROM ogrenci WHERE ogrenci_no = @student_no');
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
            const { ogrenci_no, tek_sifre } = result.recordset[0];
            const passwordMatch = await bcrypt.compare(password, tek_sifre);
            if (passwordMatch) {
                req.session.no = ogrenci_no;
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

module.exports = router;