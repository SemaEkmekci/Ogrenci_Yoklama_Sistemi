import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import StudentTableServices from "../../services/AdminPage/StudentTable";
import LessonTableServices from "../../services/AdminPage/LessonTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import useWebSocket from "./IDWebSocket";

const StudentTable = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldStudentNumber, setOldStudentNumber] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldConnectWebSocket, setShouldConnectWebSocket] = useState(false);
  const [courses, setCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);

  const userID = useWebSocket("ws://localhost:9000", shouldConnectWebSocket);

  useEffect(() => {
    if (userID && isEditing) {
      setSelectedStudent((prevStudent) => ({
        ...prevStudent,
        ogrenci_id: userID,
      }));
    }
  }, [userID, isEditing]);

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
    },
  ];

  useEffect(() => {
    fetchStudentInfo();
    handleCourseAssign();
  }, []);

  const fetchStudentInfo = async () => {
    setIsLoading(true);
    try {
      const response = await StudentTableServices.getStudentInfo();
      if (response.data.valid === false) {
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

  const handleEdit = async (row) => {
    const studentDetails = records.find(
      (student) => student.ogrenci_no === row.ogrenci_no
    );
    setOldStudentNumber(studentDetails.ogrenci_no);
    if (studentDetails) {
      setSelectedStudent({
        ...studentDetails,
        oldStudentNumber: studentDetails.ogrenci_no,
      });
      setIsEditing(false);
      setIsModalOpen(true);
    } else {
      console.error("Student details not found");
    }
  };

  const handleUpdateInfo = () => {
    setShouldConnectWebSocket(!shouldConnectWebSocket);
    setIsEditing(!isEditing);
  };

  const handleDelete = async (ogrenci_no) => {
    const confirmed = window.confirm("Silmek istiyor musunuz?");
    // if (confirmed) {
    //   try {
    //     await StudentTableServices.deleteStudent(ogrenci_no);
    //     fetchStudentInfo();
    //   } catch (error) {
    //     console.error('Error deleting student:', error);
    //   }
    // }
  };

  const handleUpdate = async () => {
    try {
      await StudentTableServices.updateStudent(selectedStudent);
      fetchStudentInfo();
      setIsModalOpen(false);
      setIsEditing(false);
      setShouldConnectWebSocket(false); // Close WebSocket connection
    } catch (error) {
      Swal.fire(
        "Hata",
        "Bilgileri kontrol edin. Güncelleme yapılamadı. Veri tabanında başkasına ait olan öğrenci no ve id ekleyemezsiniz",
        "error"
      );
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

  const handleCourseAssign = async () => {
    try {
      const response = await LessonTableServices.getLessonInfo();
      setCourses(response.data.lesson || []);
      console.log(response.data.lesson);
    } catch (error) {
      console.error("Error assigning course:", error);
    }
  };

  const handleStudentCourses = async () => {
    try {
      const response = await LessonTableServices.getLessonInfo();
      setStudentCourses(response.data.lesson || []);
      console.log(response.data.lesson);
    } catch (error) {
      console.error("Error assigning course:", error);
    }
  };

  const dataToDisplay = keyword !== "" ? filteredRecords : records;

  const paginationOptions = {
    rowsPerPageText: "Sayfa başına satır:",
    rangeSeparatorText: " / ",
  };

  const customStyles = {
    rows: {
      style: {
        "&:nth-of-type(odd)": {
          backgroundColor: "rgb(241, 241, 241)", // Tailwind's bg-gray-100
        },
        "&:nth-of-type(even)": {
          backgroundColor: "rgb(255, 255, 255)", // Tailwind's bg-white
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
            noDataComponent={
              <div className="text-center p-4">Kayıt bulunamadı</div>
            }
            customStyles={customStyles}
          />
        )}
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
            setShouldConnectWebSocket(false); // Close WebSocket connection
          }}
          heading="Öğrenci Güncelle"
        >
          <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Öğrenci Bilgileri</h2>
              <FontAwesomeIcon
                icon={faEdit}
                onClick={handleUpdateInfo}
                className="text-blue-500 cursor-pointer"
                size="lg"
                title="Düzenle"
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Öğrenci No:</label>
                  <input
                    type="number"
                    name="ogrenci_no"
                    value={selectedStudent?.ogrenci_no || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing ? "border-blue-300" : "border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Öğrenci ID:</label>
                  <input
                    type="text"
                    name="ogrenci_id"
                    value={selectedStudent?.ogrenci_id || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing ? "border-blue-300" : "border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Ad:</label>
                  <input
                    type="text"
                    name="ad"
                    value={selectedStudent?.ad || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing ? "border-blue-300" : "border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Soyad:</label>
                  <input
                    type="text"
                    name="soyad"
                    value={selectedStudent?.soyad || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing ? "border-blue-300" : "border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Bölüm:</label>
                  <input
                    type="text"
                    name="bolum"
                    value={selectedStudent?.bolum || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing ? "border-blue-300" : "border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    Bölüm Başlama Yılı:
                  </label>
                  <input
                    type="number"
                    name="bolum_baslama_yili"
                    value={selectedStudent?.bolum_baslama_yili || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing ? "border-blue-300" : "border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Ders Ekle:</label>
                  <select
                    name="course"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing ? "border-blue-300" : "border-gray-300"
                    } focus:outline-none`}
                  >
                    <option value="">Ders Seç</option>
                    {Array.isArray(courses) &&
                      courses.map((course) => (
                        <option key={course.ders_id} value={course.ders_id}>
                          {course.ders_id}-{course.ders_adi}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700">Aldığı Dersler:</label>
                  <ul className="list-disc pl-5">
                    {studentCourses.map((course) => (
                      <li key={course.ders_id}>{course.ders_adi}</li>
                    ))}
                  </ul>
                </div>
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
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentTable;
