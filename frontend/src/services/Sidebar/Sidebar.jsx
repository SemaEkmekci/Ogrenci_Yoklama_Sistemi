import axios from 'axios';

const Sidebar = {};

Sidebar.handleLogout = async () => {
    return await axios.post('http://localhost:9000/instructor/logout');
};

export default Sidebar;
