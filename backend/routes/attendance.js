const express = require("express");
const router = express.Router();
const sql = require("mssql");
const db = require("../data/db");
const xl = require('excel4node');

router.use(express.json());

router.get("/downloadAttendance", (req, res, next) => {
    const headerColumns = ["Öğrenci NO", "Öğrenci Ad", "Öğrenci Soyad", "Giriş Saati", "Çıkış Saati"];

    const data = [
        { studentNo: "21100011050", name: "Sema", surname: "EKMEK", checkInTime: "18:36:04", checkOutTime: "22.01.21" },
        { studentNo: "21100011027", name: "Sena", surname: "İNCEKENAR", checkInTime: "20:42:04", checkOutTime: "22.01.30" },
    ];
    const wb = new xl.Workbook()
    const ws = wb.addWorksheet("Kullanicilar")
    let colIndex = 1
    headerColumns.forEach((item) => {
        ws.cell(1, colIndex++).string(item)
    })
    let rowIndex = 2;
    data.forEach((item) => {
        let columnIndex = 1;
        Object.keys(item).forEach((colName) => {
            ws.cell(rowIndex, columnIndex++).string(item[colName])
        })
        rowIndex++;
    })

    const fileName = "yoklama.xlsx";

    const fileStream = wb.writeToBuffer();

    res.setHeader("Content-Disposition", "attachment;filename=" + fileName);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(fileStream);
});

module.exports = router;
