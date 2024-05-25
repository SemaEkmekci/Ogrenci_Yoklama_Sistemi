import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import StudentTableServices from "../../services/InstructorPage/ActiveLessonTable";
const ActiveLessonTable = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("tr-TR");
  const columns = [
    {
      name: "Öğrenci No",
      selector: (row) => row.ogrenci_no,
      sortable: true,
    },
    {
      name: "Ad",
      selector: (row) => row.ad,
      sortable: true,
    },
    {
      name: "Soyad",
      selector: (row) => row.soyad,
      sortable: true,
    },
    {
      name: "Bölüm",
      selector: (row) => row.bolum,
      sortable: true,
    },
    {
      name: "Derse Giriş Saati",
      selector: (row) => row.derse_giris_saati,
      sortable: true,
    },
  ];
  const paginationOptions = {
    rowsPerPageText: 'Sayfa başına satır:',
    rangeSeparatorText: ' / ',
  };

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [noRecords, setNoRecords] = useState("");
  const [activeLesson, setActiveLesson] = useState("");
  const [lessonTime, setLessonTime] = useState("");

  useEffect(() => {
    fetchStudentInfo();
    const interval = setInterval(() => {
      fetchStudentInfo();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchStudentInfo = async () => {
    try {
      const response = await StudentTableServices.getStudentInfo();
      console.log(response);
      if (response.data.valid) {
        if (response.data.state === "no_student") {
          setActiveLesson(response.data.lesson.ders_adi);
          setLessonTime(response.data.lesson.ders_saati);
          setNoRecords(response.data.message);
        } else if (response.data.state === "no_lesson") {
          setNoRecords(response.data.message);
        } else {
          setActiveLesson(response.data.lesson.ders_adi);
          setLessonTime(response.data.lesson.ders_saati);
          setRecords(response.data.students);
        }
      }
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  };

  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    setKeyword(keyword);

    if (records && records.length > 0) {
      const filteredData = records.filter(
        (item) =>
          item.ogrenci_no.toString().toLowerCase().includes(keyword) ||
          item.ad.toLowerCase().includes(keyword) ||
          item.soyad.toLowerCase().includes(keyword) ||
          item.bolum.toLowerCase().includes(keyword)
      );
      setFilteredRecords(filteredData);
    } else {
      setFilteredRecords([]);
    }
  };

  const dataToDisplay = keyword !== "" ? filteredRecords : records;
  console.log(dataToDisplay);

  return (
    <div className="container">
      <h1 className="text-3xl font-semibold">Aktif Ders Yoklaması</h1>
      <h1 className="text-xl font-semibold">
        {formattedDate} - {activeLesson}
      </h1>
      <h4>{lessonTime}</h4>

      <div className="text-end mb-2">
        <input
          type="text"
          className="px-3 py-1 border-2 border-gray-400 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out hover:border-blue-300"
          placeholder="Ara..."
          onChange={handleFilter}
        />
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={dataToDisplay}
          searchable={true}
          pagination={true}
          paginationComponentOptions={paginationOptions}
          noDataComponent={<div className="text-center p-4">{noRecords}</div>}
          fixedHeader
          responsive
        />
      </div>
    </div>
  );
};

export default ActiveLessonTable;
