import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import Modal from './Modal';
import ReadExcelSave from '../../services/AdminPage/ReadExcelSave';

const ReadExcelStudent = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      Swal.fire('Hata', 'Lütfen yalnızca Excel veya CSV formatında dosya yükleyin.', 'error');
      setUploadStatus('error');
      return;
    }

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setUploadedData(jsonData);

        setUploadStatus('success');
        setModalIsOpen(true);
      } catch (error) {
        Swal.fire('Hata', 'Dosya okuma sırasında bir hata oluştu. Lütfen dosya formatını kontrol edin.', 'error');
        setUploadStatus('error');
      }
    };

    reader.onerror = () => {
      Swal.fire('Hata', 'Dosya yükleme başarısız oldu.', 'error');
      setUploadStatus('error');
    };

    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xlsx, .xls, .csv',
    onDropRejected: () => {
      Swal.fire('Hata', 'Lütfen yalnızca Excel veya CSV formatında dosya yükleyin.', 'error');
      setUploadStatus('error');
    }
  });

  const closeModal = () => {
    setModalIsOpen(false);
    setUploadStatus(null);
    setLoading(false);
  };

  const handleSaveToDatabase = async () => {
    setLoading(true);
    try {
      const response = await ReadExcelSave.saveToDatabase(uploadedData);
      if (response.data.valid === false) {
        window.location.reload();
        return;
      }
      if (response.data.error === 242) {
        console.log(response);
        Swal.fire('Hatalı Veri', `Hatalı Veri Girdiniz. ${response.data.details}`, 'error');
        setLoading(false);
      } else {
        console.log('Veritabanına başarıyla kaydedildi:', response.data);
        Swal.fire('Başarılı', 'Veritabanına başarıyla kaydedildi', 'success');
        closeModal();
      }
    } catch (error) {
      console.log("Hata");
      console.error('Veritabanına kaydedilirken hata oluştu:', error);
      Swal.fire('Hata', 'Veritabanına kaydedilirken hata oluştu.', 'error');
      setLoading(false);
    }
  };

  const columns = uploadedData.length > 0 ? Object.keys(uploadedData[0]).map(key => ({
    name: key,
    selector: row => row[key],
    sortable: true,
  })) : [];

  const paginationOptions = {
    rowsPerPageText: 'Sayfa başına satır:',
    rangeSeparatorText: ' / ',
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Öğrenci Ekle</h1>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div {...getRootProps()} className="w-96 p-6 border-4 border-dashed border-blue-400 bg-white rounded-lg text-center cursor-pointer hover:bg-blue-50 transition">
          <input {...getInputProps()} className="hidden" />
          <p className="text-gray-500">{isDragActive ? 'Dosyayı bırakın' : 'Buraya sürükleyip bırakın veya dosya seçin'}</p>
          <p className="text-gray-400 mt-2">Dosya yüklemek için tıklayın</p>
        </div>

        <div className="mt-10 w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Yüklemeniz Gereken Dosya Formatı</h2>
          <p className="text-gray-600 mb-4">Excel veya csv dosyanızın aşağıdaki sütunları içermesi gerekmektedir:</p>

          <div className="overflow-auto mb-6">
            <table className="table-auto w-full text-left border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ogrenci_no</th>
                  <th className="border border-gray-300 px-4 py-2">ogrenci_id</th>
                  <th className="border border-gray-300 px-4 py-2">tek_sifre</th>
                  <th className="border border-gray-300 px-4 py-2">ad</th>
                  <th className="border border-gray-300 px-4 py-2">soyad</th>
                  <th className="border border-gray-300 px-4 py-2">bolum</th>
                  <th className="border border-gray-300 px-4 py-2">bolum_baslama_yili</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">21100011050</td>
                  <td className="border border-gray-300 px-4 py-2">S123456</td>
                  <td className="border border-gray-300 px-4 py-2">password123</td>
                  <td className="border border-gray-300 px-4 py-2">Sema</td>
                  <td className="border border-gray-300 px-4 py-2">Ekmek</td>
                  <td className="border border-gray-300 px-4 py-2">Bilgisayar Mühendisliği</td>
                  <td className="border border-gray-300 px-4 py-2">2021</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">21100011051</td>
                  <td className="border border-gray-300 px-4 py-2">S123457</td>
                  <td className="border border-gray-300 px-4 py-2">password456</td>
                  <td className="border border-gray-300 px-4 py-2">Sena</td>
                  <td className="border border-gray-300 px-4 py-2">İncekara</td>
                  <td className="border border-gray-300 px-4 py-2">Endüstri Mühendisliği</td>
                  <td className="border border-gray-300 px-4 py-2">2020</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Sütun Açıklamaları</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li><strong>ogrenci_no:</strong> Öğrenci numarası</li>
              <li><strong>ogrenci_id:</strong> Öğrenci okul kartı kimliği</li>
              <li><strong>tek_sifre:</strong> Tek şifre</li>
              <li><strong>ad:</strong> Adı</li>
              <li><strong>soyad:</strong> Soyadı</li>
              <li><strong>bolum:</strong> Bölümü</li>
              <li><strong>bolum_baslama_yili:</strong> Bölüme başlama yılı</li>
            </ul>
          </div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onClose={closeModal}
          heading="Excel Dosyası İçeriği"
          description=""
        >
          {loading ? (
            <div className="text-center p-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p>Veriler yükleniyor... <br />Ekranı Kapatmayın</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={uploadedData}
                pagination={true}
                paginationComponentOptions={paginationOptions}
                noDataComponent={
                  <div className="text-center p-4">Yüklenen dosyanın içeriği yok</div>
                }
                fixedHeader
                responsive
              />
              <div className="flex justify-between mt-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSaveToDatabase}
                >
                  Sisteme Kaydet
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReadExcelStudent;
