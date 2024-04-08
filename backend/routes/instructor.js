const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const db = require("../data/db");
const router = express.Router();

router.post("/login", async (req, res) => {
    console.log("hebele hübele");
    const { userName, password } = req.body;
    console.log(userName, password);
    try {
        const pool = await db.getConnection();
        const request = pool.request();
        request.input('userName', sql.VarChar, userName);
        request.input('password', sql.VarChar, password);
        const result = await request.query('SELECT * FROM akademisyen WHERE akademisyen_tc = @userName');
            
        if (result.recordset.length === 1) {
            const { tek_sifre } = result.recordset[0];
            const passwordMatch = await bcrypt.compare(password, tek_sifre);

            if (passwordMatch) {
            const { akademisyen_tc, ad, soyad, unvan, bolum } = result.recordset[0];
            const responseData = { success: true, message: "Başarılı giriş", result: { akademisyen_tc, ad, soyad, unvan, bolum } };
            res.status(200).json(responseData);
        } else {
            res.json({ success: false, message: "Şifre hatalı" });
        }
        } else {
            res.json({ success: false});
        }
    } 
    catch (error) {
        console.error("Giriş hatası:", error);
        // res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
});

module.exports = router;
