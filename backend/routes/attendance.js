const express = require("express");
const router = express.Router();
const xl = require('excel4node');
const db = require("../data/db");
const sql = require("mssql");

router.use(express.json());

router.post("/downloadAttendance", async (req, res, next) => {
  try {
    const headerColumns = ["Öğrenci NO", "Öğrenci Ad", "Öğrenci Soyad", "Giriş Saati", "Çıkış Saati"];
    const { lessonName, selectedDate } = req.body;

    const pool = await db.getConnection();
    const request = pool.request();
    request.input('lessonName', sql.VarChar, lessonName);
    request.input('selectedDate', sql.VarChar, selectedDate);

    const query = `
      SELECT yl.ogrenci_no, o.ad, o.soyad, yl.derse_giris_saati, yl.dersten_cikis_saati 
      FROM yoklama_listeleri yl
      INNER JOIN ogrenci o ON yl.ogrenci_no = o.ogrenci_no  
      WHERE yl.ders_id = (
        SELECT d.ders_id
        FROM ders d
        WHERE d.ders_adi = @lessonName
      ) AND yl.yoklama_tarihi = @selectedDate
    `;

    const result = await request.query(query);

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("attendance");

    let colIndex = 1;
    headerColumns.forEach((item) => {
      ws.cell(1, colIndex++).string(item);
    });

    let rowIndex = 2;
    result.recordset.forEach((item) => {
      let columnIndex = 1;
      Object.keys(item).forEach((colName) => {
        ws.cell(rowIndex, columnIndex++).string(item[colName].toString());
      });
      rowIndex++;
    });

    const filePath = "./attendance.xlsx";
    wb.write(filePath);

    res.download(filePath, "attendance_list.xlsx");
  } catch (error) {
    console.error('Failed to generate attendance list:', error);
    res.status(500).send('Failed to generate attendance list');
  }
});

module.exports = router;
