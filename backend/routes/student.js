const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const db = require("../data/db");
const router = express.Router();
const session = require('express-session')


router.use(express.json());

// router.get("/info", (req, res) =>{
//     res.send("Sema");
// });

router.get('/', (req, res) => {
    if(req.session.no){
        return res.json({valid: true, no: req.session.no})
    }
    else{
        return res.json({valid:false})
    }
    // req.session.view = 8;
    // req.session.no = 211000;
    // console.log(req.session);
    // res.send('Session set');
});


router.get("/info", async (req, res) => {
    try {
        console.log(req.session);
        console.log(req.session.view); 

        console.log(req.session.no);
        res.send({ success: true, message: req.session.no });
    
    } catch (error) {
        console.error("Oturum bilgilerini alma hatası:", error);
        res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
});

// router.get("/info", async (req, res) => {
//     try {
//         console.log(req.session);
//         console.log(req.session.view);

//         console.log(req.session.no);
        
//         if (!req.session.no) {
//             console.log(req.session);
//             return res.status(404).json({ success: false, message: "Oturum bulunamadı" });
//         }

//         const pool = await db.getConnection();
//         const request = pool.request();
//         request.input('ogrenci_no', sql.VarChar, ogrenci_no);
//         const result = await request.query('SELECT ogrenci_no, ad, soyad, bolum, bolum_baslama_yili FROM ogrenci WHERE ogrenci_no = @ogrenci_no');

//         if (result.recordset.length === 1) {
//             const { ogrenci_no, ad, soyad, bolum, bolum_baslama_yili } = result.recordset[0];
//             res.status(200).json({ success: true, ogrenci_no, ad, soyad, bolum, bolum_baslama_yili });
//         } else {
//             res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
//         }
//     } catch (error) {
//         console.error("Oturum bilgilerini alma hatası:", error);
//         res.status(500).json({ success: false, message: "Sunucu hatası" });
//     }
// });




router.post("/login", async (req, res) => {
    console.log("hebele hübele");
    const { studentNumber, password } = req.body;
    // const hashedPassword = await bcrypt.hash(password,15);
    // console.log(hashedPassword);
    try {
        const pool = await db.getConnection();
        const request = pool.request();
        request.input('studentNumber', sql.VarChar, studentNumber);
        const result = await request.query('SELECT * FROM ogrenci WHERE ogrenci_no = @studentNumber');     
        if (result.recordset.length === 1) {
            const { ogrenci_no, tek_sifre } = result.recordset[0];
            const passwordMatch = await bcrypt.compare(password, tek_sifre);
            if (passwordMatch) {
                req.session.no = "211000110";
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
