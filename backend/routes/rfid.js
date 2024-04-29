const express = require("express");
const router = express.Router();
const sql = require("mssql");
const db = require("../data/db");


router.use(express.json());

router.get("/info", (req, res) =>{
    res.send("Sema");
});


router.post("/ID", async (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
    const currentDate = new Date(); 
    const options = { timeZone: "Europe/Istanbul" };
    const currentLocaleDate = currentDate.toLocaleDateString("tr-TR", options);
    console.log("Şu anki tarih:", currentLocaleDate);
    const currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false });
    console.log(currentTime);
    const currentDay = currentDate.getDay();
    console.log("Bugünün günü:", currentDay);
    const pool = await db.getConnection();
    const request = pool.request();    

    request.input('currentDay', sql.VarChar, currentDay.toString());
    request.input('currentTime', sql.VarChar, currentTime);
    request.input('currentClass', sql.VarChar, data.classID);
    
    console.log(currentDay);
    console.log(currentTime);
    const lessonResult = await request.query('SELECT * FROM ders_programi INNER JOIN sinif ON ders_programi.sinif_id = sinif.sinif_id WHERE ders_gunu = @currentDay AND baslangic_saati <= @currentTime AND bitis_saati >= @currentTime AND ders_programi.sinif_id = (select sinif_id from sinif where sinif_adi = @currentClass)')
    
    console.log(lessonResult);
    request.input('userID', sql.VarChar, data.userID);
    const studentInfoResult = await request.query('SELECT ogrenci_no, ad, soyad, bolum FROM ogrenci WHERE ogrenci_id = @userID');
    const result = await request.query('SELECT * FROM ogrenci_ders WHERE ogrenci_id = @userID');
    console.log(result);

    const bitisSaatiString = lessonResult.recordset[0].bitis_saati.toISOString().split("T");


    if (result.recordset.length === 1) {

        const insertQuery = `
        INSERT INTO yoklama_listeleri (yoklama_tarihi, ders_id, ogrenci_no, derse_giris_saati, dersten_cikis_saati)
        VALUES (@currentDate, @lessonID, @studentNo,@entryTime, @exitTime)
    `;

    const parameters = {
        currentDate: currentLocaleDate,
        lessonID: lessonResult.recordset[0].ders_id,
        studentNo: studentInfoResult.recordset[0].ogrenci_no,
        entryTime: currentTime,
        exitTime: bitisSaatiString[1].split(".000Z")[0]
    };
    
    request.input('currentDate', sql.VarChar, parameters.currentDate);
    request.input('lessonID', sql.VarChar, parameters.lessonID);
    request.input('studentNo', sql.VarChar, parameters.studentNo);
    request.input('entryTime', sql.VarChar, parameters.entryTime);
    request.input('exitTime', sql.VarChar, parameters.exitTime);

    await request.query(insertQuery, parameters);
}
    
    res.json("success");
});



module.exports = router;
