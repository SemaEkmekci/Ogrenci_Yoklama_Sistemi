import React, { useRef, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faCircleXmark,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons";
import AttendanceTableServices from "../../services/InstructorPage/AttendanceListTable";
import AttendanceDownloadServices from "../../services/InstructorPage/DownloadAttendanceList";
import "react-tooltip/dist/react-tooltip.css"; // Tooltip stillerini dahil edin

const Modal = ({ isOpen, onClose, heading, description }) => {
  const modalRef = useRef(null);
  const [records, setRecords] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      handleAttendanceList(heading);
    }
  }, [isOpen, heading]);

  const handleAttendanceList = async (heading) => {
    try {
      setIsLoading(true);
      const response = await AttendanceTableServices.postDateInfo(heading);
      const dates = response.data.dates;
      const studentRecords = {};

      for (const date of dates) {
        const attendanceResponse = await AttendanceTableServices.postLessonInfo(
          heading,
          date
        );
        const attendanceList = attendanceResponse.data.attendanceList;

        attendanceList.forEach((record) => {
          if (!studentRecords[record.ogrenci_no]) {
            studentRecords[record.ogrenci_no] = {
              ogrenci_no: record.ogrenci_no,
              ad: record.ad,
              soyad: record.soyad,
              attendance: {},
            };
          }
          studentRecords[record.ogrenci_no].attendance[date] =
            record.derse_giris_saati;
        });
      }

      const dateColumns = dates.map((date) => ({
        name: date,
        selector: (row) => (
          <div className="flex justify-center items-center">
            {row.attendance[date] ? (
              <span
                onMouseEnter={(e) =>
                  handleMouseEnter(
                    e,
                    `Derse Giriş Saati: ${row.attendance[date]}`
                  )
                }
                onMouseLeave={handleMouseLeave}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500 group-hover:text-green-600 text-lg"
                />
              </span>
            ) : (
              <span
                onMouseEnter={(e) => handleMouseEnter(e, "Katılmadı")}
                onMouseLeave={handleMouseLeave}
              >
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="text-red-500 group-hover:text-red-600 text-lg"
                />
              </span>
            )}
          </div>
        ),
        center: true, // Center the column content
      }));

      const staticColumns = [
        {
          name: "Öğrenci NO",
          selector: (row) => row.ogrenci_no,
          sortable: true,
        },
        { name: "Öğrenci Ad", selector: (row) => row.ad, sortable: true },
        { name: "Öğrenci Soyad", selector: (row) => row.soyad, sortable: true },
      ];

      setColumns([...staticColumns, ...dateColumns]);
      setRecords(Object.values(studentRecords));
    } catch (error) {
      console.error("Failed to get attendance list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAttendanceList = async (heading) => {
    try {
      const response = await AttendanceDownloadServices.downloadAttendanceList(
        heading
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${heading}-yoklama.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Yoklama Listesi İndirilirken Hata Oluştu:", error);
    }
  };

  const paginationOptions = {
    rowsPerPageText: "Sayfa başına satır:",
    rangeSeparatorText: " / ",
  };

  const handleMouseEnter = (e, content) => {
    const { clientX: x, clientY: y } = e;
    setTooltip({ visible: true, content, x, y });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: "", x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-[850px] h-120"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{heading}</h2>
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center p-4">Yükleniyor...</div>
          ) : (
            <DataTable
              columns={columns}
              data={records}
              searchable={true}
              pagination={true}
              paginationComponentOptions={paginationOptions}
              noDataComponent={
                <div className="text-center p-4">Yoklama kaydı bulunamadı</div>
              }
              fixedHeader
              responsive
            />
          )}
        </div>
        <div className="flex justify-between">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleDownloadAttendanceList(heading)}
          >
            Yoklama Listesi İndir
          </button>
        </div>
        {tooltip.visible && (
          <div
            className="fixed bg-gray-800 text-white text-sm py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300"
            style={{
              top: tooltip.y + 10,
              left: tooltip.x + 10,
              opacity: tooltip.visible ? 1 : 0,
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
