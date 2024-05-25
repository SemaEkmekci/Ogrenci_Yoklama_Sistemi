CREATE DATABASE oys;

USE oys;

CREATE TABLE akademisyen (
	akademisyen_tc VARCHAR(11) PRIMARY KEY,
    akademisyen_id VARCHAR(10) UNIQUE,
	tek_sifre VARCHAR(50),
    ad VARCHAR(50),
    soyad VARCHAR(50),
    unvan VARCHAR(50),
    bolum VARCHAR(50)
);

CREATE TABLE ogrenci (
    ogrenci_no VARCHAR(11) PRIMARY KEY,
	ogrenci_id VARCHAR(10) UNIQUE,
	tek_sifre VARCHAR(50),
    ad VARCHAR(50),
    soyad VARCHAR(50),
    bolum VARCHAR(50),
    bolum_baslama_yili INT	
);

CREATE TABLE bolum (
    bolum_id VARCHAR(10) PRIMARY KEY,
    bolum_adi VARCHAR(100)
);

CREATE TABLE sinif (
    sinif_id VARCHAR(10) PRIMARY KEY,
    sinif_adi VARCHAR(100)
);

CREATE TABLE ders(
	ders_id VARCHAR(10) PRIMARY KEY,
    ders_adi VARCHAR(100)
);

CREATE TABLE ders_programi (
	akademisyen_id VARCHAR(10),
    ders_id VARCHAR(10),
    bolum_id VARCHAR(10),
	sinif_id VARCHAR(10),
    ders_gunu VARCHAR(20),
    baslangic_saati TIME,
    bitis_saati TIME,
    FOREIGN KEY (bolum_id) REFERENCES bolum(bolum_id),
	FOREIGN KEY (ders_id) REFERENCES ders(ders_id),
	FOREIGN KEY (akademisyen_id) REFERENCES akademisyen(akademisyen_id),
	FOREIGN KEY (sinif_id) REFERENCES sinif(sinif_id)
);

CREATE TABLE yoklama_listeleri (
    yoklama_id INT IDENTITY(1,1) PRIMARY KEY,
    yoklama_tarihi VARCHAR(10),
	ders_id VARCHAR(10),
    ogrenci_no VARCHAR(11),
    derse_giris_saati VARCHAR(20),
    dersten_cikis_saati VARCHAR(20)
    FOREIGN KEY (ders_id) REFERENCES ders(ders_id),
    FOREIGN KEY (ogrenci_no) REFERENCES ogrenci(ogrenci_no)
);

CREATE TABLE ogrenci_ders (
    ogrenci_ders_id INT PRIMARY KEY,
    ogrenci_id VARCHAR(10),
    ders_id VARCHAR(10),
	bolum_id VARCHAR(10),
    FOREIGN KEY (ogrenci_id) REFERENCES ogrenci(ogrenci_id),
    FOREIGN KEY (ders_id) REFERENCES ders(ders_id)
);

CREATE TABLE devamsizlik (
    devamsizlik_id INT IDENTITY(1,1) PRIMARY KEY,
    tarih VARCHAR(15),
    ders_id VARCHAR(10),
    ogrenci_no VARCHAR(11)
    FOREIGN KEY (ders_id) REFERENCES ders(ders_id),
    FOREIGN KEY (ogrenci_no) REFERENCES ogrenci(ogrenci_no)
);

INSERT INTO bolum (bolum_id, bolum_adi) VALUES
('BIL', 'Bilgisayar Mühendisliği'),
('END', 'Endüstri Mühendisliği');

INSERT INTO sinif (sinif_id, sinif_adi) VALUES
('1', 'C107'),
('2', 'C108');

INSERT INTO ders (ders_id, ders_adi) VALUES
('BIL338', 'Gömülü Sistemler'),
('BIL113', 'Algoritma ve Programlama'),
('BIL302', 'Bilgisayar Ağları'),
('BIL331', 'Web Programlama'),
('BIL305', 'Veri Tabanı Sistemleri'),
('BIL301', 'Bilgisayar Mimarisi ve Organizasyonu'),
('BIL205', 'LOJİK DEVRELER VE TASARIMI'),
('BIL216', 'Mikroişlemciler ve Mikrodenetleyiciler')


INSERT INTO ders_programi ( akademisyen_id, ders_id, bolum_id, sinif_id, ders_gunu, baslangic_saati, bitis_saati) VALUES
('22222222', 'BIL338', 'BIL', '1',  '1', '09:00', '11:45'),
('11111111', 'BIL113', 'BIL', '2',  '2', '09:00', '11:45'),
('22222222', 'BIL302', 'BIL', '2', '3', '09:00', '11:45');

insert into ogrenci_ders(ogrenci_ders_id, ogrenci_id, ders_id, bolum_id)
values
(3, '00000001', 'BIL216', 'BIL')

INSERT INTO akademisyen (akademisyen_tc,akademisyen_id, tek_sifre, ad, soyad, unvan, bolum)
VALUES
('22222222222', '22222222','55555','Test', 'AKADEMİSYEN', 'Yardımcı Doçent', 'Bİlgisayar Mühendisliği');


INSERT INTO ogrenci (ogrenci_no, ogrenci_id, tek_sifre, ad, soyad, bolum, bolum_baslama_yili)
VALUES
('21100011050', '00000001','15963','Sema Nur', 'EKMEKCİ', 'Bilgisayar Mühendisliği', '2021'),
('21100011099', 'D3536215','123987','Test', 'ÖĞRENCİ', 'Bilgisayar Mühendisliği', '2021');

INSERT INTO devamsizlik (tarih, ders_id, ogrenci_no)
values('02.05.2024', 'BIL338', '21100011050')











