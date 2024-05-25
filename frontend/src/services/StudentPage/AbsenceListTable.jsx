import axios from 'axios';

const AbsenceListTableInfo = {};

AbsenceListTableInfo.postLessonInfo = (lessonName) => {
  axios.defaults.withCredentials = true;
  return axios.post('http://localhost:9000/student/absenceList', {
    lessonName: lessonName,
  });
}

export default AbsenceListTableInfo;
