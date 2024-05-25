import axios from "axios";

const InstructorInfo = {};

InstructorInfo.getInstructorInfo = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/instructor/info");
};

InstructorInfo.getLessonInstructor = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/instructor/lessonInstructor");
};

export default InstructorInfo;
