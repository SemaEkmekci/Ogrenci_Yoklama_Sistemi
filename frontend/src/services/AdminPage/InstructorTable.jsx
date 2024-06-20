import axios from "axios";


const getInstructorInfo = () => {
  axios.defaults.withCredentials = true;
  return axios.get("http://localhost:9000/admin/instructor");
};



const InstructorTableServices = {
    getInstructorInfo
  };
export default InstructorTableServices;
