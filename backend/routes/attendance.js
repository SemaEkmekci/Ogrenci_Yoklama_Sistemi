const express = require("express");
const router = express.Router();
const xl = require("excel4node");
const db = require("../data/db");
const sql = require("mssql");

router.use(express.json());

router.post("/downloadAttendance", async (req, res, next) => {
  try {
    const { lessonName } = req.body;

    const pool = await db.getConnection();
    const request = pool.request();
    request.input("lessonName", sql.VarChar, lessonName);

    const datesQuery = `
      SELECT DISTINCT yl.yoklama_tarihi
      FROM yoklama_listeleri yl
      INNER JOIN ders d ON yl.ders_id = d.ders_id
      WHERE d.ders_adi = @lessonName
    `;

    const datesResult = await request.query(datesQuery);
    let dates = datesResult.recordset.map(row => row.yoklama_tarihi);

    // Tarihleri sıralama
    dates = dates.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('.').map(Number);
      const [dayB, monthB, yearB] = b.split('.').map(Number);
      return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    const studentsQuery = `
      SELECT o.ogrenci_no, o.ad, o.soyad
      FROM ogrenci o
      INNER JOIN yoklama_listeleri yl ON o.ogrenci_no = yl.ogrenci_no
      INNER JOIN ders d ON yl.ders_id = d.ders_id
      WHERE d.ders_adi = @lessonName
      GROUP BY o.ogrenci_no, o.ad, o.soyad
    `;

    const studentsResult = await request.query(studentsQuery);
    const students = studentsResult.recordset;

    const attendanceQuery = `
      SELECT yl.ogrenci_no, yl.yoklama_tarihi, 
             CASE WHEN yl.derse_giris_saati IS NOT NULL THEN 1 ELSE 0 END AS attendance
      FROM yoklama_listeleri yl
      INNER JOIN ders d ON yl.ders_id = d.ders_id
      WHERE d.ders_adi = @lessonName
    `;

    const attendanceResult = await request.query(attendanceQuery);
    const attendance = attendanceResult.recordset;

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("attendance");

    let colIndex = 1;
    const headerColumns = ["Öğrenci NO", "Öğrenci Ad", "Öğrenci Soyad", ...dates];
    headerColumns.forEach((item) => {
      ws.cell(1, colIndex++).string(item);
    });

    let rowIndex = 2;
    students.forEach(student => {
      let columnIndex = 1;
      ws.cell(rowIndex, columnIndex++).string(student.ogrenci_no);
      ws.cell(rowIndex, columnIndex++).string(student.ad);
      ws.cell(rowIndex, columnIndex++).string(student.soyad);
      
      dates.forEach(date => {
        const record = attendance.find(att => att.ogrenci_no === student.ogrenci_no && att.yoklama_tarihi === date);
        ws.cell(rowIndex, columnIndex++).number(record ? record.attendance : 0);
      });

      rowIndex++;
    });

    // Dosyayı yanıt olarak yaz
    wb.write('attendance.xlsx', res);
  } catch (error) {
    console.error("Failed to generate attendance list:", error);
    res.status(500).send("Failed to generate attendance list");
  }
});

module.exports = router;
