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
    const currentTime = currentDate.getHours().toString().padStart(2, '0') + ':' + 
                    currentDate.getMinutes().toString().padStart(2, '0') + ':' +
                    currentDate.getSeconds().toString().padStart(2, '0');
    
    console.log(currentTime);
    const currentDay = currentDate.getDay();
    console.log("Bugünün günü:", currentDay);
    const pool = await db.getConnection();
    const request = pool.request();    

    request.input('currentDay', sql.VarChar, currentDay.toString());
    request.input('currentTime', sql.VarChar, currentTime);
    request.input('currentClass', sql.VarChar, data.classID);
    request.input('currentDate', sql.VarChar, currentLocaleDate);

    
    console.log(currentDay);
    console.log(currentTime);
    console.log(data.classID);

    const lessonResult = await request.query(`
    SELECT * FROM ders_programi 
    INNER JOIN sinif ON ders_programi.sinif_id = sinif.sinif_id 
    WHERE ders_gunu = @currentDay 
    AND baslangic_saati <= @currentTime 
    AND bitis_saati >= @currentTime 
    AND ders_programi.sinif_id = (SELECT sinif_id FROM sinif WHERE sinif_adi = @currentClass)
`);

    console.log(lessonResult);

    request.input('userID', sql.VarChar, data.userID);
    request.input('lessonID', sql.VarChar, lessonResult.recordset[0].ders_id);
    const studentInfoResult = await request.query('SELECT ogrenci_no, ad, soyad, bolum FROM ogrenci WHERE ogrenci_id = @userID');
    console.log(data.userID);
    console.log(lessonResult.recordset[0].ders_id);

    const result = await request.query('SELECT * FROM ogrenci_ders WHERE ogrenci_id = @userID and ders_id=@lessonID');
    console.log(studentInfoResult);
    console.log(result);

if (lessonResult.recordset.length === 1) {

    const bitisSaatiString = lessonResult.recordset[0].bitis_saati.toISOString().split("T");
    if (result.recordset.length === 1) {

        request.input('studentNo', sql.VarChar, studentInfoResult.recordset[0].ogrenci_no);
        
        const attendanceCheck =  await request.query('SELECT * FROM yoklama_listeleri WHERE ders_id=@lessonID and ogrenci_no = @studentNo and yoklama_tarihi = @currentDate');
        console.log("KONTROL",attendanceCheck);
        if(attendanceCheck.recordset.length === 1){
            return res.json({
                message: "success",
                lessonState: "on",
                studentState: "off",
                lessonName: lessonResult.recordset[0].ders_id,
                msg: "Yoklamanız Alındı"
                });

        }


        const insertQuery = `
        INSERT INTO yoklama_listeleri (yoklama_tarihi, ders_id, ogrenci_no, derse_giris_saati, dersten_cikis_saati)
        VALUES (@currentDate, @lessonID, @studentNo,@entryTime, @exitTime)
    `;

    const parameters = {
        currentDate: currentLocaleDate,
        
        entryTime: currentTime,
        exitTime: bitisSaatiString[1].split(".000Z")[0]
    };
    
    // request.input('currentDate', sql.VarChar, parameters.currentDate);
    request.input('entryTime', sql.VarChar, parameters.entryTime);
    request.input('exitTime', sql.VarChar, parameters.exitTime);

    await request.query(insertQuery, parameters);
    }
    else{
        return res.json({
            message: "success",
            lessonState: "on",
            studentState: "off",
            lessonName: lessonResult.recordset[0].ders_id,
            msg: "DERSE KAYDINIZ YOK"
            });
    

    }
}else{
    return res.json({
        message: "success",
        lessonState: "off",
        msg: "DERS YOK"
        });
    
}
    let studentNo = studentInfoResult.recordset[0].ogrenci_no;
    let hiddenStudentNo = studentNo.substring(0, 3) + '*'.repeat(studentNo.length - 5) + studentNo.substring(studentNo.length - 2);
    let studentName = studentInfoResult.recordset[0].ad;
    let hiddenStudentName = studentName.substring(0, 4) + '*'.repeat(3)
    let studentSurname = studentInfoResult.recordset[0].soyad;
    let hiddenStudentSurname = studentSurname.substring(0, 4) + '*'.repeat(3)

    let responseInfo = {
    message: "success",
    lessonState: "on",
    lessonName: lessonResult.recordset[0].ders_id,
    ogrenci_no: hiddenStudentNo,
    ad: hiddenStudentName,
    soyad: hiddenStudentSurname
    };
   
    res.json(responseInfo);
});



module.exports = router;
