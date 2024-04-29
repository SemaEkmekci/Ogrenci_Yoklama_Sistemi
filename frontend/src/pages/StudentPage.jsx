import React, { useEffect, useState } from 'react';
// import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import StudentInfo from '../services/StudentPage/StudentInfo';


const StudentPage = () => {
  const [no, setNo] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [department, setDepartment] = useState('');

  const navigate = useNavigate(); 

  useEffect(() => {
    StudentInfo.getStudentInfo()
      .then(res => {
        console.log(res);
        if (res.data.valid) {
          setNo(res.data.ogrenci_no);
          setName(res.data.ad);
          setSurname(res.data.soyad);
          setDepartment(res.data.department);
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);
  
  return (
    <div>
      StudentPage
      {no}
      {name}
      {surname}
      {department}
    </div>
  )
}

export default StudentPage