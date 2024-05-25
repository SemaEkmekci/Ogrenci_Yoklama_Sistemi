import axios from "axios";

const StudentInfo = {};

StudentInfo.getStudentInfo = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/instructor/students");
};

export default StudentInfo;
