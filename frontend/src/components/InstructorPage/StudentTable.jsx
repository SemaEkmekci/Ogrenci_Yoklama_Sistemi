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
  const [filterColor, setFilterColor] = useState("");

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
    filterData(keyword, filterColor);
  };

  const filterData = (keyword, color) => {
    let filteredData = records;

    if (keyword) {
      filteredData = filteredData.filter(
        (item) =>
          normalizeText(item.ogrenci_no.toString()).includes(keyword) ||
          normalizeText(item.ad).includes(keyword) ||
          normalizeText(item.soyad).includes(keyword) ||
          normalizeText(item.bolum).includes(keyword) ||
          normalizeText(item.ders_adi).includes(keyword) ||
          normalizeText(item.toplam_devamsizlik.toString()).includes(keyword)
      );
    }

    if (color) {
      filteredData = filteredData.filter((item) => {
        if (color === "green") return item.toplam_devamsizlik < 4;
        if (color === "yellow") return item.toplam_devamsizlik === 4;
        if (color === "red") return item.toplam_devamsizlik > 4;
        return true; 
      });
    }

    setFilteredRecords(filteredData);
  };

  const handleColorFilter = (color) => {
    setFilterColor(color);
    filterData(keyword, color);
  };

  const dataToDisplay = keyword !== "" || filterColor !== "" ? filteredRecords : records;

  const paginationOptions = {
    rowsPerPageText: "Sayfa başına satır:",
    rangeSeparatorText: " / ",
  };

  const ColorFilterButtons = () => (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <button
          className="w-6 h-6 bg-white border-2 border-gray-400"
          onClick={() => handleColorFilter("")}
        ></button>
        <span className="ml-2 text-sm">Hepsi</span>
      </div>
      <div className="flex items-center">
        <button
          className="w-6 h-6 bg-green-500 border-2 border-gray-400"
          onClick={() => handleColorFilter("green")}
        ></button>
        <span className="ml-2 text-sm">Geçti</span>
      </div>
      <div className="flex items-center">
        <button
          className="w-6 h-6 bg-yellow-500 border-2 border-gray-400"
          onClick={() => handleColorFilter("yellow")}
        ></button>
        <span className="ml-2 text-sm">Sınırda</span>
      </div>
      <div className="flex items-center">
        <button
          className="w-6 h-6 bg-red-500 border-2 border-gray-400"
          onClick={() => handleColorFilter("red")}
        ></button>
        <span className="ml-2 text-sm">Kaldı</span>
      </div>
    </div>
  );

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
      <div className="overflow-x-auto relative">
        <DataTable
          columns={columns}
          data={dataToDisplay}
          pagination={true}
          paginationComponentOptions={paginationOptions}
          conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          responsive
          noDataComponent={<div className="text-center p-4">Kayıt bulunamadı</div>}
        />
        <div className="absolute bottom-0 left-0 p-4 flex items-center space-x-4">
          <ColorFilterButtons />
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
