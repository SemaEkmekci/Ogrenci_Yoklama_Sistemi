__NEÜ Bilgisayar Mühendisliği 3.sınıf Bahar Dönemi Seçmeli Gömülü Sistemler Final Proje Ödevi__

[21100011050.pdf](https://github.com/user-attachments/files/16274831/21100011050.pdf)

# Student Attendance System

For this project assignment, integration of RFID-RC522 and OLED display with ESP32 microcontroller will be realized.

## frontend
    cd frontend
    npm install
    npm start
## backend
    cd backend
    npm install
    npm start


## Kullanılan Teknolojiler

### Gömülü Yazılım

- **Arduino:** Arduino, Wiring tabanlı C/C++'a çok yakın bir dil ile programlama dilidir. Arduino kaynak kod dosyalarına (*.ino) Sketch (taslak) adı verilir.
- **Arduino IDE:** Processing temel alınarak geliştirilmiştir. Platform bağımsızdır (Linux, Mac, Windows). Alt seviyede GCC derleyicisini kullanır. Arduino IDE Java ile geliştirilmiştir. Açık kaynaklıdır.

### Frontend Yazılım

- **React.js:** React, bileşenlere dayalı kullanıcı arayüzleri oluşturmaya yönelik ücretsiz ve açık kaynaklı bir ön uç JavaScript kitaplığıdır.
- **Tailwind CSS:** Tailwind CSS açık kaynaklı bir CSS çerçevesidir.

### Backend Yazılım

- **Node.js:** Node.js, geliştiricilerin sunucular, web uygulamaları, komut satırı araçları ve komut dosyaları oluşturmasına olanak tanıyan ücretsiz, açık kaynaklı, platformlar arası bir JavaScript çalışma zamanı ortamıdır.

### Veritabanı

- **MSSQL:** Microsoft SQL Server, Microsoft tarafından geliştirilen ve yönetilen bir ilişkisel veritabanı yönetim sistemidir. SQL Server, büyük ve karmaşık veritabanlarını depolamak, yönetmek, sorgulamak ve işlemek için kullanılan bir yazılım ürünüdür. Veri depolama, veri güvenliği, yedekleme, geri yükleme, veri entegrasyonu, analiz ve raporlama gibi çeşitli veritabanı yönetimi işlevlerini destekler.

## Bağlantı Şemaları

### RFID-RC522 - ESP32

| RFID-RC522 | ESP32       |
|------------|-------------|
| SDA        | D5          |
| SCK        | D18         |
| MOSI       | D23         |
| MISO       | D19         |
| IRQ        | Free        |
| GND        | GND         |
| RST        | D4          |
| 3.3V       | 3.3V        |

### OLED I2C - ESP32

| OLED I2C   | ESP32       |
|------------|-------------|
| GND        | GND         |
| VDD        | 3.3V        |
| SCK        | D22         |
| SDA        | D21         |


![image](https://github.com/user-attachments/assets/ab7b8dc0-3122-431d-9b6e-3b220447ff95)



## Fritzing Scheme and Real Image Comparison

<div style="display: flex; justify-content: space-around;">
    <img src="https://github.com/user-attachments/assets/fd1098c0-9bac-448c-8c2c-9c552ed38800" alt="Fritzing Scheme" width="400"/>
    <img src="https://github.com/user-attachments/assets/8c76a72a-83d6-4477-a762-295355b55716" alt="Real Image" width="400"/>
</div>


## Project Description

Within the scope of the project, the RFID-RC522 module will be connected and utilized via digital pins on the ESP32. Similarly, the OLED display will also be integrated using the I2C (Two-Wire Interface) connection points of the ESP32.

In this project, an electronic attendance system has been developed aiming to manage student attendance processes in a regular and efficient manner. This system enables querying attendance information via web services and recording entry-exit times. While student information is obtained via RFID module in the terminal units placed in classrooms, the ESP32 board communicates with the server over the network through its built-in Wi-Fi module to perform attendance recording operations. This developed system will automatically read and process student attendance data, significantly reducing the time spent and errors made in manual attendance processes. Thus, the efficiency of classes will increase, and instructors will be able to use class time more effectively. The automatic attendance system will allow instructors to use their time more efficiently and make student attendance tracking more reliable and error-free.

Bu çalışmada, öğrenci devamsızlık süreçlerinin düzenli ve etkin bir şekilde yönetilmesini hedefleyen bir elektronik yoklama sistemi geliştirilmiştir. Bu sistem, web servisler aracılığıyla yoklama bilgilerinin sorgulanmasını ve giriş-çıkış zamanlarının kaydedilmesini sağlar. Sınıflara yerleştirilen uç birimlerinde RFID modülü aracılığıyla öğrenci bilgisini alınırken, ESP32 kartında bulunan wifi modülü sayesinde ağ üzerinden sunucuyla iletişim kurarak yoklama kayıt işlemlerini gerçekleştirir. Geliştirilen bu sistem, öğrenci devamsızlık verilerini otomatik olarak okuyup işleyerek, manuel yoklama sürecinde harcanan zamanı ve yapılan hataları önemli ölçüde azaltacaktır. Böylece, derslerin verimliliği artacak ve eğitmenler, ders süresini daha etkin kullanabilecektir. Otomatik yoklama sistemi, eğitmenlerin zamanını daha verimli kullanmasını sağlarken, öğrenci devamsızlık takibini daha güvenilir ve hatasız hale getirecektir.

![System-architect](https://github.com/SemaEkmekci/Ogrenci_Yoklama_Sistemi/assets/94064744/959651a1-9e77-4b1d-bf15-c656e4866a95)


## Veri Tabanı Şeması
![image](https://github.com/user-attachments/assets/fb041d58-c336-4adb-b1d8-f849dda12a62)


## Web Interface
### Akademisyen
![1](https://github.com/SemaEkmekci/Ogrenci_Yoklama_Sistemi/assets/94064744/7150a680-3ee9-4dcd-897f-28e8d634ca70)

![image](https://github.com/user-attachments/assets/6048712c-8ad0-46de-9868-c770018935c3)

![image](https://github.com/user-attachments/assets/99391a10-6665-4d44-a37f-ea35343f8f78)
![image](https://github.com/user-attachments/assets/b26726c3-f0ea-4aca-8e59-d3d0194e50e4)
![image](https://github.com/user-attachments/assets/33bc493c-8548-4cab-914a-b64badbb04df)
![image](https://github.com/user-attachments/assets/0a8827ca-b6c7-4049-809d-2adfde6be0a0)



### Öğrenci
![image](https://github.com/SemaEkmekci/Ogrenci_Yoklama_Sistemi/assets/94064744/b5b4b30f-bcfe-4d15-b28a-0e57be5bb88f)



![8](https://github.com/SemaEkmekci/Ogrenci_Yoklama_Sistemi/assets/94064744/2f64bf69-43c8-46f8-95b8-711213e673a6)

![image](https://github.com/user-attachments/assets/a9954753-6948-4e1c-8b9c-60cf6c401002)

## Yönetici
![image](https://github.com/user-attachments/assets/c6927cb1-08d4-4ecc-864f-d61d9d216671)
![image](https://github.com/user-attachments/assets/790a5283-9aa9-4496-abe0-89c2d689d7d9)
![image](https://github.com/user-attachments/assets/d5f5672c-2308-428f-912a-d9f90a200f52)
![image](https://github.com/user-attachments/assets/7fcce483-9f07-48af-bf1b-9d62b4b06f13)
![image](https://github.com/user-attachments/assets/ad2fcc6a-c0d4-4761-af06-86eec5debe59)
![image](https://github.com/user-attachments/assets/1c570357-6aa5-4e4e-8ff2-66b154dc12f5)
![image](https://github.com/user-attachments/assets/9ae69554-7e03-447d-94a2-56f2faadbb21)
![image](https://github.com/user-attachments/assets/f7bd5f48-ab9b-4faa-ab8e-30731de56842)







