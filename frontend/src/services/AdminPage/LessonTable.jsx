import axios from "axios";


const getLessonInfo = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/admin/lesson");
};



const lessonTableServices = {
    getLessonInfo
  };
export default lessonTableServices;
