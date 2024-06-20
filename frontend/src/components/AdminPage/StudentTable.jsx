import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import StudentTableServices from "../../services/AdminPage/StudentTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare, faEdit } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';


const StudentTable = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      name: "İşlemler",
      cell: (row) => (
        <div>
          <FontAwesomeIcon
            icon={faPenToSquare}
            onClick={() => handleEdit(row)}
            className="text-blue-500 cursor-pointer mr-2"
            size="lg"
            title="Güncelle"
          />
          <FontAwesomeIcon
            icon={faTrashCan}
            onClick={() => handleDelete(row.ogrenci_no)}
            className="text-red-500 cursor-pointer"
            size="lg"
            title="Sil"
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  const fetchStudentInfo = async () => {
    setIsLoading(true);
    try {
      const response = await StudentTableServices.getStudentInfo();
      if(response.data.valid === false){
        window.location.reload();
      }
      setRecords(response.data.students);
      setFilteredRecords(response.data.students);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching student info:", error);
      setError("Öğrenci bilgileri alınamadı.");
      setIsLoading(false);
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
    filterData(keyword);
  };

  const filterData = (keyword) => {
    let filteredData = records;

    if (keyword) {
      filteredData = filteredData.filter(
        (item) =>
          normalizeText(item.ogrenci_no.toString()).includes(keyword) ||
          normalizeText(item.ad).includes(keyword) ||
          normalizeText(item.soyad).includes(keyword) ||
          normalizeText(item.bolum).includes(keyword)
      );
    }
    setFilteredRecords(filteredData);
  };

  const handleEdit = (row) => {
    setSelectedStudent(row);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (ogrenci_no) => {
    const confirmed = window.confirm("Silmek istiyor musunuz?");
    if (confirmed) {
      try {
        await StudentTableServices.deleteStudent(ogrenci_no);
        // Update the list after student deletion
        fetchStudentInfo();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await StudentTableServices.updateStudent(selectedStudent);
      fetchStudentInfo();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const dataToDisplay = keyword !== "" ? filteredRecords : records;

  const paginationOptions = {
    rowsPerPageText: "Sayfa başına satır:",
    rangeSeparatorText: " / ",
  };

  const customStyles = {
    rows: {
      style: {
        '&:nth-of-type(odd)': {
          backgroundColor: 'rgb(241, 241, 241)', // Tailwind's bg-gray-100
        },
        '&:nth-of-type(even)': {
          backgroundColor: 'rgb(255, 255, 255)', // Tailwind's bg-white
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Öğrenciler</h1>
      <div className="text-end mb-4">
        <input
          type="text"
          className="px-3 py-1 border-2 border-gray-400 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out hover:border-blue-300"
          placeholder="Ara..."
          value={keyword}
          onChange={handleFilter}
        />
      </div>
      <div className="overflow-x-auto relative">
        {isLoading ? (
          <div className="text-center p-4">Yükleniyor...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : (
          <DataTable
            columns={columns}
            data={dataToDisplay}
            pagination={true}
            paginationComponentOptions={paginationOptions}
            fixedHeader
            responsive
            noDataComponent={<div className="text-center p-4">Kayıt bulunamadı</div>}
            customStyles={customStyles}
          />
        )}
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          heading="Öğrenci Güncelle"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Öğrenci Bilgileri</h2>
            <FontAwesomeIcon
              icon={faEdit}
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-500 cursor-pointer"
              size="lg"
              title="Düzenle"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Öğrenci No:</label>
              <input
                type="text"
                name="ogrenci_no"
                value={selectedStudent?.ogrenci_no || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-blue-300' : 'border-gray-300'} focus:outline-none`}
              />
            </div>
            <div>
              <label className="block text-gray-700">Ad:</label>
              <input
                type="text"
                name="ad"
                value={selectedStudent?.ad || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-blue-300' : 'border-gray-300'} focus:outline-none`}
              />
            </div>
            <div>
              <label className="block text-gray-700">Soyad:</label>
              <input
                type="text"
                name="soyad"
                value={selectedStudent?.soyad || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-blue-300' : 'border-gray-300'} focus:outline-none`}
              />
            </div>
            <div>
              <label className="block text-gray-700">Bölüm:</label>
              <input
                type="text"
                name="bolum"
                value={selectedStudent?.bolum || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-blue-300' : 'border-gray-300'} focus:outline-none`}
              />
            </div>
          </div>
          {isEditing && (
            <div className="text-right mt-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Güncelle
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default StudentTable;
