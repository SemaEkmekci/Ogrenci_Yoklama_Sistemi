import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import LessonTableServices from "../../services/AdminPage/LessonTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare, faEdit } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';

const LessonTable = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      name: "Ders Kodu",
      selector: (row) => row.ders_id,
      sortable: true,
    },
    {
        name: "Ders Adı",
        selector: (row) => row.ders_adi,
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
            onClick={() => handleDelete(row.ders_id)}
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
    fetchLessonInfo();
  }, []);

  const fetchLessonInfo = async () => {
    setIsLoading(true);
    try {
      const response = await LessonTableServices.getLessonInfo();
      console.log('Fetched data:', response.data); // Debugging log
      if (response.data.valid === false) {
        window.location.reload();
      }
      setRecords(response.data.lesson);
      setFilteredRecords(response.data.lesson);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lesson info:", error);
      setError("Ders bilgileri alınamadı.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Records updated:', records); // Debugging log
  }, [records]);

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
          normalizeText(item.ders_adi).includes(keyword) ||
          normalizeText(item.ders_id).includes(keyword)
      );
    }
    setFilteredRecords(filteredData);
  };

  const handleEdit = (row) => {
    setSelectedLesson(row);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Silmek istiyor musunuz?");
    if (confirmed) {
      try {
        await LessonTableServices.deleteLesson(id);
        fetchLessonInfo();
      } catch (error) {
        console.error("Error deleting lesson:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await LessonTableServices.updateLesson(selectedLesson);
      fetchLessonInfo();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedLesson((prevLesson) => ({
      ...prevLesson,
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
      <h1 className="text-3xl font-semibold mb-4">Dersler</h1>
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
          heading="Ders Güncelle"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Ders Bilgileri</h2>
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
              <label className="block text-gray-700">Ders Adı:</label>
              <input
                type="text"
                name="ders_adi"
                value={selectedLesson?.ders_adi || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-blue-300' : 'border-gray-300'} focus:outline-none`}
              />
            </div>
            <div>
              <label className="block text-gray-700">Ders Kodu:</label>
              <input
                type="text"
                name="ders_id"
                value={selectedLesson?.ders_id || ''}
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

export default LessonTable;
