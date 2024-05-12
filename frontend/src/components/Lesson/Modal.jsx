import React, { useRef, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import AttendanceTableServices from '../../services/InstructorPage/AttendanceListTable';

const Modal = ({ isOpen, onClose, heading, description,  selectedDate, setSelectedDate }) => {
  const modalRef = useRef(null);
  const [dateOptions, setDateOptions] = useState([]);
  const [records, setRecords] = useState([]);

  const handleAttendanceDate = async (heading) => {
    try {
      const response = await AttendanceTableServices.postDateInfo(heading);
      setDateOptions(response.data.dates)
      console.log(response);
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      handleAttendanceDate(heading);
    }
  }, [isOpen, heading]);

  if (!isOpen) return null;

  const columns = [
    {
      name: 'Öğrenci NO',
      selector: row => row.ogrenci_no,
      sortable: true,
    },
    {
      name: 'Öğrenci Ad',
      selector: row => row.ad,
      sortable: true,
    },
    {
      name: 'Öğrenci Soyad',
      selector: row => row.soyad,
      sortable: true,
    },
    {
      name: 'Giriş Saati',
      selector: row => row.derse_giris_saati,
      sortable: true,
    },
    {
      name: 'Çıkış Saati',
      selector:row => row.dersten_cikis_saati,
      sortable: true,
    },
  ];


  const handleAttendanceList = async (heading, selectedDate) => {
    try {
      const response = await AttendanceTableServices.postLessonInfo(heading,selectedDate);
      console.log(response);
      setRecords(response.data.attendanceList)
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-160 h-120">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{heading}</h2>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>X</button>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        
        <select
          className="block w-full p-2 bg-gray-100 rounded-md mb-4"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            handleAttendanceList(heading, e.target.value);
          }}
        >
           <option value="" disabled={true} hidden={true}>Tarih Seç</option>
          {dateOptions.map((date, index) => (
            <option key={index} value={date}>{date}</option>
          ))}
        </select>
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={records}
            searchable={true}
            pagination={true}
            fixedHeader
            responsive
          />
        </div>
        <div className="flex justify-between">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Yoklama Listesi İndir</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
