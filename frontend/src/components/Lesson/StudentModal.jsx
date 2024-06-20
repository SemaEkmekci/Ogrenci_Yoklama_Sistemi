import React, { useRef, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import AbsenceListTableServices from "../../services/StudentPage/AbsenceListTable";
import AttendanceListTableServices from "../../services/StudentPage/AttendanceListTable";

const Modal = ({ isOpen, onClose, heading, description }) => {
  const modalRef = useRef(null);
  const [absenceRecords, setAbsenceRecords] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      handleAbsenceList(heading);
      handleAttendanceList(heading);
    }
  }, [isOpen, heading]);

  const handleAbsenceList = async (heading) => {
    try {
      const response = await AbsenceListTableServices.postLessonInfo(heading);
      console.log(response);
      setAbsenceRecords(response.data.attendanceList);
    } catch (error) {
      console.error("Failed to get absence list:", error);
    }
  };

  const handleAttendanceList = async (heading) => {
    try {
      const response = await AttendanceListTableServices.postLessonInfo(heading);
      console.log(response);
      setAttendanceRecords(response.data.attendanceList);
    } catch (error) {
      console.error("Failed to get attendance list:", error);
    }
  };

  const processRecords = (absenceRecords, attendanceRecords) => {
    const records = [];

    // Combine absence and attendance records
    absenceRecords.forEach((record) => {
      records.push({ date: record.devamsizlik_tarihi, type: "absence" });
    });

    attendanceRecords.forEach((record) => {
      records.push({ date: record.yoklama_tarihi, type: "attendance" });
    });

    // Sort records by date
    records.sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')));

    // Prepare columns
    const columns = records.map((record, index) => ({
      name: (
        <div className="whitespace-nowrap transform -rotate-45 text-center w-12 border-r border-gray-300">
          {record.date}
        </div>
      ),
      selector: (row) => row[`date_${index}`],
      cell: () => (
        <div className="flex justify-center items-center h-full">
          {record.type === "absence" ? (
            <FontAwesomeIcon icon={faCircleXmark} className="text-red-600" />
          ) : (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          )}
        </div>
      ),
      wrap: true,
      grow: 0,
      width: "60px",
    }));

    const data = [{}];
    records.forEach((record, index) => {
      data[0][`date_${index}`] = record.type === "absence" ? "X" : "✓";
    });

    return { columns, data };
  };

  const { columns, data } = processRecords(absenceRecords, attendanceRecords);

  const totalAbsences = absenceRecords.length;
  const totalAttendances = attendanceRecords.length;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-auto max-w-4xl max-h-full overflow-y-auto mx-4 md:mx-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{heading}</h2>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex justify-around mb-4 space-x-4">
          <div className="flex-1 p-4 bg-red-100 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Toplam Devamsızlık</h3>
            <p className="text-3xl font-bold text-red-600">{totalAbsences}</p>
          </div>
          <div className="flex-1 p-4 bg-green-100 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Toplam Katılım</h3>
            <p className="text-3xl font-bold text-green-600">{totalAttendances}</p>
          </div>
        </div>
        <div className="mb-4 p-4 rounded-lg shadow-lg border border-gray-200">
          <DataTable
            columns={columns}
            data={data}
            noDataComponent={<div className="text-center p-4">Bilginiz Yok</div>}
            fixedHeader
            responsive
            customStyles={{
              header: {
                style: {
                  minHeight: "0",
                  fontSize: "14px", 
                  fontWeight: "bold",
                  color: "#333", 
                },
              },
              headRow: {
                style: {
                  padding: "0",
                },
              },
              headCells: {
                style: {
                  paddingLeft: "0",
                  paddingRight: "0",
                  borderRight: "1px solid #ccc",  
                  fontSize: "11px",
                  fontWeight: "bold", 
                  color: "#555", 
                },
              },
              cells: {
                style: {
                  paddingLeft: "8px", 
                  paddingRight: "8px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRight: "1px solid #ccc", 
                  fontSize: "22px", 
                  color: "#555", 
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
