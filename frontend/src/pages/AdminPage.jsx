import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorInfo from "../services/InstructorPage/InstructorInfo";
import Sidebar from "../layout/SidebarAdmin";
import StudentTable from "../components/AdminPage/StudentTable";
import InstructorTable from "../components/AdminPage/InstructorTable";
import LessonTable from "../components/AdminPage/LessonTable";
import ReadExcelStudent from "../components/AdminPage/ReadExcelStudent";
import ReadExcelInstructor from "../components/AdminPage/ReadExcelInstructor";
import ReadExcelLesson from "../components/AdminPage/ReadExcelLesson";

const AdminPage = () => {
  const [academicTitle, setTitle] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [department, setDepartment] = useState("");
  const [showStudentTable, setStudentTable] = useState(true);
  const [showInstructorTable, setInstructorTable] = useState(false);
  const [showLessonTable, setLessonTable] = useState(false);
  const [showReadExcelStudent, setReadExcelStudent] = useState(false);
  const [showReadExcelInstructor, setReadExcelInstructor] = useState(false);
  const [showReadExcelLesson, setReadExcelLesson] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    InstructorInfo.getInstructorInfo()
      .then((res) => {
        console.log(res);
        if (res.data.valid) {
          setTitle(res.data.unvan);
          setName(res.data.ad);
          setSurname(res.data.soyad);
          setDepartment(res.data.bolum);
        } else {
          navigate("/");
          console.log("hebele hübele");
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleStudentTable = () => {
    setReadExcelStudent(false);
    setInstructorTable(false);
    setStudentTable(true);
    setReadExcelLesson(false);
    setReadExcelInstructor(false);
    setLessonTable(false);
  };

  const handleInstructorTable = () => {
    setReadExcelStudent(false);
    setInstructorTable(true);
    setStudentTable(false);
    setReadExcelLesson(false);
    setReadExcelInstructor(false);
    setLessonTable(false);
  };

  const handleLessonTable = () => {
    setReadExcelStudent(false);
    setInstructorTable(false);
    setStudentTable(false);
    setReadExcelLesson(false);
    setReadExcelInstructor(false);
    setLessonTable(true);
  };

  const handleReadExcel = () => {
    setStudentTable(false);
    setInstructorTable(false);
    setReadExcelLesson(false);
    setReadExcelStudent(true);
    setReadExcelInstructor(false);
    setLessonTable(false);
  };

  const handleReadExcelInstructor = () => {
    setStudentTable(false);
    setReadExcelStudent(false);
    setInstructorTable(false);
    setReadExcelLesson(false);
    setReadExcelInstructor(true);
    setLessonTable(false);
  };

  const handleReadExcelLesson = () => {
    setStudentTable(false);
    setReadExcelStudent(false);
    setInstructorTable(false);
    setReadExcelInstructor(false);
    setReadExcelLesson(true);
    setLessonTable(false);
  };

  return (
    <div className="flex">
      <div className=" bg-gray-800 text-white h-screen flex flex-col">
        <Sidebar
          academicTitle={academicTitle}
          name={name}
          surname={surname}
          department={department}
          handleStudentTable={handleStudentTable}
          handleInstructorTable={handleInstructorTable}
          handleLessonTable={handleLessonTable}
          handleReadExcel={handleReadExcel}
          handleReadExcelInstructor={handleReadExcelInstructor}
          handleReadExcelLesson={handleReadExcelLesson}
        />
      </div>

      <div className="w-full bg-gray-100 p-8">
        <div className="max-w-7xl ml-64">
          <div className="flex flex-wrap"></div>
          <div>{showStudentTable && <StudentTable />}</div>
          <div>{showInstructorTable && <InstructorTable />}</div>
          <div>{showLessonTable && <LessonTable />}</div>
          <div>{showReadExcelStudent && <ReadExcelStudent />}</div>
          <div>{showReadExcelInstructor && <ReadExcelInstructor />}</div>
          <div>{showReadExcelLesson && <ReadExcelLesson />}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
