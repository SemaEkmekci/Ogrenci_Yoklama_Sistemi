import axios from "axios";

const StudentInfo = {};

StudentInfo.getStudentInfo = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/student/info");
};

StudentInfo.getLessonStudent = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/student/lesson");
};
export default StudentInfo;
