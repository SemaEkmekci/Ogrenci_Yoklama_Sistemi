import axios from 'axios';

const StudentInfo = {};

StudentInfo.getStudentInfo = () => {
  axios.defaults.withCredentials = true
  return axios.get('http://localhost:9000/student/info');
}

export default StudentInfo;
