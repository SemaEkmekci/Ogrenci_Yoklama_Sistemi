import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import StudentTableServices from "../../services/InstructorPage/StudentTable";

const StudentTable = () => {
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
      name: "Aldığı Ders",
      selector: (row) => row.ders_adi,
      sortable: true,
    },
    {
      name: "Devamsızlık Bilgisi",
      selector: (row) => row.toplam_devamsizlik,
      sortable: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.toplam_devamsizlik < 4,
      style: {
        backgroundColor: "#c3e6cb", // Light green
        color: "#155724",
      },
    },
    {
      when: (row) => row.toplam_devamsizlik === 4,
      style: {
        backgroundColor: "#ffeeba", // Light orange
        color: "#856404",
      },
    },
    {
      when: (row) => row.toplam_devamsizlik > 4,
      style: {
        backgroundColor: "#f5c6cb", // Light red
        color: "#721c24",
      },
    },
  ];

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  const fetchStudentInfo = async () => {
    try {
      const response = await StudentTableServices.getStudentInfo();
      setRecords(response.data.students);
      setFilteredRecords(response.data.students); // İlk yüklemede tüm verileri göster
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  };

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const handleFilter = (e) => {
    const keyword = normalizeText(e.target.value);
    setKeyword(keyword);

    if (keyword === "") {
      setFilteredRecords(records);
    } else {
      const filteredData = records.filter(
        (item) =>
          normalizeText(item.ogrenci_no.toString()).includes(keyword) ||
          normalizeText(item.ad).includes(keyword) ||
          normalizeText(item.soyad).includes(keyword) ||
          normalizeText(item.bolum).includes(keyword) ||
          normalizeText(item.ders_adi).includes(keyword) ||
          normalizeText(item.toplam_devamsizlik.toString()).includes(keyword)
      );
      setFilteredRecords(filteredData);
    }
  };

  const paginationOptions = {
    rowsPerPageText: 'Sayfa başına satır:',
    rangeSeparatorText: ' / ',
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-semibold">Öğrenciler</h1>
      <div className="text-end mb-2">
        <input
          type="text"
          className="px-3 py-1 border-2 border-gray-400 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out hover:border-blue-300"
          placeholder="Ara..."
          value={keyword}
          onChange={handleFilter}
        />
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredRecords}
          pagination={true}
          paginationComponentOptions={paginationOptions}
          conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          responsive
        />
      </div>
    </div>
  );
};

export default StudentTable;
