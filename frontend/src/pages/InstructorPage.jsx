import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorInfo from '../services/InstructorPage/InstructorInfo';
import Sidebar from '../layout/Sidebar';
import Card from '../components/Lesson/Card';
import image from '../components/Lesson/image.json';
import StudentTable from '../components/InstructorPage/StudentTable';
import ActiveLessonTable from '../components/InstructorPage/ActiveLessonTable';

const InstructorPage = () => {
  
  const [academicTitle, setTitle] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [department, setDepartment] = useState('');
  const [lessons, setLessons] = useState([]);
  const [showCards, setShowCards] = useState(true);
  const [showStudentTable, setStudentTable] = useState(false);
  const [showActiveLesson, setActiveLesson] = useState(false);

  const navigate = useNavigate(); 
  useEffect(() => {
    InstructorInfo.getInstructorInfo()
      .then(res => {
        console.log(res);
        if (res.data.valid) {
          setTitle(res.data.unvan);
          setName(res.data.ad);
          setSurname(res.data.soyad);
          setDepartment(res.data.bolum);
        } else {
          navigate('/');
          console.log("hebele hübele");
        }
      })
      .catch(err => console.log(err));

    InstructorInfo.getLessonInstructor()
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
    setStudentTable(false);
    setActiveLesson(false);
    setShowCards(true);
  };

  const handleStudentTable = () => {
    setShowCards(false);
    setActiveLesson(false);
    setStudentTable(true);
  };

  const handleActiveLesson = () => {
    setShowCards(false);
    setStudentTable(false);
    setActiveLesson(true);
  };

  return (
    <div className="flex">
      <div  className=" bg-gray-800 text-white h-screen flex flex-col">
      <Sidebar 
        academicTitle={academicTitle}
        name={name}
        surname={surname}
        department={department} 
        handleShowCards={handleShowCards}
        handleStudentTable={handleStudentTable}
        handleActiveLesson={handleActiveLesson}
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
  <div>

  {showStudentTable &&  <StudentTable />}

  </div>

  <div>
  {showActiveLesson &&  <ActiveLessonTable />}
  </div>
</div>
      </div>
    </div>
  );
}

export default InstructorPage;