import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorInfo from "../services/InstructorPage/InstructorInfo";
import Sidebar from "../layout/SidebarAdmin";
import StudentTable from "../components/AdminPage/StudentTable";
import InstructorTable from "../components/AdminPage/InstructorTable";
import ReadExcelStudent from "../components/AdminPage/ReadExcelStudent";
import ReadExcelInstructor from "../components/AdminPage/ReadExcelInstructor";

const AdminPage = () => {
  const [academicTitle, setTitle] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [department, setDepartment] = useState("");
  const [showStudentTable, setStudentTable] = useState(true);
  const [showInstructorTable, setInstructorTable] = useState(false);
  const [showReadExcelStudent, setReadExcelStudent] = useState(false);
  const [showReadExcelInstructor, setReadExcelInstructor] = useState(false);

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
    setReadExcelStudent(false)
    setInstructorTable(false)
    setStudentTable(true);
    setReadExcelInstructor(false)
  };
  
  const handleInstructorTable = () => {
    setReadExcelStudent(false)
    setInstructorTable(true)
    setStudentTable(false);
    setReadExcelInstructor(false)
  };


  const handleReadExcel = () => {
    setStudentTable(false);
    setInstructorTable(false)
    setReadExcelStudent(true)
    setReadExcelInstructor(false)
  };

  const handleReadExcelInstructor = () => {
    setStudentTable(false);
    setReadExcelStudent(false)
    setInstructorTable(false)
    setReadExcelInstructor(true)
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
          handleReadExcel={handleReadExcel}
          handleReadExcelInstructor={handleReadExcelInstructor}
        />
      </div>

      <div className="w-full bg-gray-100 p-8">
        <div className="max-w-7xl ml-64">
          <div className="flex flex-wrap">
          </div>
          <div>{showStudentTable && <StudentTable />}</div>
          <div>{showInstructorTable && <InstructorTable />}</div>
          <div>{showReadExcelStudent && <ReadExcelStudent />}</div>
          <div>{showReadExcelInstructor && <ReadExcelInstructor />}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
