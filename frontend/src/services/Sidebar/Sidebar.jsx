import axios from "axios";

const Sidebar = {};

Sidebar.handleLogout = async () => {
  axios.defaults.withCredentials = true;
  return await axios.post("http://localhost:9000/instructor/logout");
};

export default Sidebar;
