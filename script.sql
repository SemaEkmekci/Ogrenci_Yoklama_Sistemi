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


PRINT 'Veriler #TempTable tablosunda:';
SELECT * FROM #TempTable;

PRINT 'Veriler yoklama_listeleri tablosunda:';
SELECT * FROM yoklama_listeleri WHERE yoklama_tarihi = @bugunun_tarihi;


DECLARE cur CURSOR FOR
SELECT ders_id, ogrenci_no
FROM #TempTable;

DECLARE @ders_id VARCHAR(50);
DECLARE @ogrenci_no VARCHAR(50);

OPEN cur;
FETCH NEXT FROM cur INTO @ders_id, @ogrenci_no;

WHILE @@FETCH_STATUS = 0
BEGIN
   
    PRINT 'ders_id: ' + @ders_id + ', ogrenci_no: ' + @ogrenci_no;

    
    PRINT 'Devamsizlik tablosuna eklenecek satirlar:';
    SELECT *
    FROM #TempTable t
    WHERE t.ders_id = @ders_id AND t.ogrenci_no = @ogrenci_no;


    INSERT INTO devamsizlik (tarih, ders_id, ogrenci_no)
    SELECT @bugunun_tarihi AS tarih, t.ders_id, t.ogrenci_no
    FROM #TempTable t
    WHERE t.ders_id = @ders_id AND t.ogrenci_no = @ogrenci_no;

    IF @@ROWCOUNT = 0
    BEGIN
        PRINT 'Eklenmedi: ders_id: ' + @ders_id + ', ogrenci_no: ' + @ogrenci_no;
    END
    ELSE
    BEGIN
        PRINT 'Eklendi: ders_id: ' + @ders_id + ', ogrenci_no: ' + @ogrenci_no;
    END

    FETCH NEXT FROM cur INTO @ders_id, @ogrenci_no;
END;


CLOSE cur;
DEALLOCATE cur;


PRINT 'Veriler devamsizlik tablosunda:';
SELECT * FROM devamsizlik;

DROP TABLE #TempTable;