import axios from "axios";


const AttendanceListTableInfo = {};



AttendanceListTableInfo.postLessonInfo = (lessonName) => {
  axios.defaults.withCredentials = true;
  return axios.post("http://localhost:9000/student/attendanceList", {
    lessonName: lessonName,
  });
};


export default AttendanceListTableInfo;
