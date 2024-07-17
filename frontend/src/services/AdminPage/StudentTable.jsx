import axios from "axios";

const StudentInfo = {};

StudentInfo.getStudentInfo = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/admin/students");
};

StudentInfo.getLesson = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/admin/lesson-student");
};

StudentInfo.updateStudent = async (data) => {
  axios.defaults.withCredentials = true;
  console.log(data);
  try {
    const response = await axios.put("http://localhost:9000/admin/update-student", data);
    return response.data;
  } catch (error) {
    console.error("Veri güncelleme hatası:", error);
    throw error;
  }
};

export default StudentInfo;
