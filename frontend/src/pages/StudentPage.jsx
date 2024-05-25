import React, { useEffect, useState } from 'react';
// import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import StudentInfo from '../services/StudentPage/StudentInfo';
import Sidebar from '../layout/SidebarStudent';
import Card from '../components/Lesson/StudentCard';
import image from '../components/Lesson/image.json';




const StudentPage = () => {
  const [no, setNo] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [department, setDepartment] = useState('');
  const [lessons, setLessons] = useState([]);
  const [showCards, setShowCards] = useState(true);


  const navigate = useNavigate(); 

  useEffect(() => {
    StudentInfo.getStudentInfo()
      .then(res => {
        console.log(res);
        if (res.data.valid) {
          setNo(res.data.ogrenci_no);
          setName(res.data.ad);
          setSurname(res.data.soyad);
          setDepartment(res.data.bolum);
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err));

      StudentInfo.getLessonStudent()
      .then(res => {
        console.log(res);
        if (res.data.valid) {
          setLessons(res.data.lessons);
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);

  const handleShowCards = () => {
    setShowCards(true);
  };

  return (
    <div className="flex">
       <div  className=" bg-gray-800 text-white h-screen flex flex-col">
      <Sidebar
        studentNo={no}
        name={name}
        surname={surname}
        department={department} 
        handleShowCards={handleShowCards}
      />
      </div>

      <div className="w-full bg-gray-100 p-8">
      <div className="max-w-7xl ml-64">
      {showCards && <h1 className="text-3xl font-semibold mb-8">Dersler</h1>}
  <div className="flex flex-wrap">
    {showCards && 
      lessons.map((lesson, index) => (
        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 ml-8">
          <Card 
            imageUrl={image.image[index].url}
            heading={lesson.ders_adi}
            description={lesson.bolum_adi}
          />       
        </div>
      ))
    }   
  </div>

</div>
      </div>
    </div>
  )
}

export default StudentPage