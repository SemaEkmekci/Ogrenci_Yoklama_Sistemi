import React, { useRef, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';


import AbsenceListTableServices from '../../services/StudentPage/AbsenceListTable';
const Modal = ({ isOpen, onClose, heading, description }) => {
  const modalRef = useRef(null);
  const [records, setRecords] = useState([]);


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
      handleAbsenceList(heading);
    }
  }, [isOpen, heading]);
  

 

  if (!isOpen) return null;

  const columns = [
    {
      name: 'Devamsızlık Tarihi',
      selector: row => row.devamsizlik_tarihi,
      sortable: true,
    },
    {
      name: 'Ders Başlangıç',
      selector: row => row.ders_baslangic,
      sortable: true,
    },
    {
      name: 'Ders Bitiş',
      selector: row => row.ders_bitis,
      sortable: true,
    }
  ];

  const handleAbsenceList = async (heading) => {
    try {
      const response = await AbsenceListTableServices.postLessonInfo(heading);
      console.log(response);
      setRecords(response.data.attendanceList);
    } catch (error) {
      console.error('Failed to get attendance list:', error);
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

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={records}
            searchable={true}
            pagination={true}
            noDataComponent={<div className="text-center p-4">Devamsızlık Bilginiz Yok</div>}
            fixedHeader
            responsive
          />
        </div>
       
      </div>
    </div>
  );
};

export default Modal;
