DECLARE @bugunun_tarihi VARCHAR(15);
SET @bugunun_tarihi = CONVERT(VARCHAR(10), GETDATE(), 104);


SELECT
    @bugunun_tarihi AS tarih,
    od.ders_id,
    o.ogrenci_no
INTO
    #TempTable
FROM
    ogrenci_ders od
INNER JOIN
    ogrenci o ON od.ogrenci_id = o.ogrenci_id
LEFT JOIN
    yoklama_listeleri y ON od.ders_id = y.ders_id AND o.ogrenci_no = y.ogrenci_no AND y.yoklama_tarihi = @bugunun_tarihi
WHERE
     y.yoklama_tarihi IS NULL;

SELECT * FROM #TempTable;
SELECT * FROM yoklama_listeleri;

SELECT *
FROM #TempTable
WHERE ders_id = (SELECT ders_id FROM yoklama_listeleri WHERE yoklama_tarihi = @bugunun_tarihi);

INSERT INTO devamsizlik (tarih, ders_id, ogrenci_no)
SELECT @bugunun_tarihi AS tarih, t.ders_id, t.ogrenci_no
FROM #TempTable t
WHERE t.ders_id = (SELECT ders_id FROM yoklama_listeleri WHERE yoklama_tarihi = @bugunun_tarihi);
SELECT * FROM devamsizlik;

DROP TABLE #TempTable;
