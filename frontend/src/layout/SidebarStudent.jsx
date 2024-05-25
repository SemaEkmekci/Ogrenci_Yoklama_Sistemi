import React from 'react';
import { useNavigate } from 'react-router-dom';
import NEULOGO from '../assets/NEULogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import SidebarService from '../services/Sidebar/Sidebar';

const Sidebar = ({ studentNo, name, surname, department, handleShowCards}) => {
    
    const navigate = useNavigate(); 

    const handleLogout = async () => {
        try {
            SidebarService.handleLogout()
            .then(res => {
                console.log(res);
                if (res.data.success) {
                    navigate('/');
                } else {
                  console.log("Çıkış Yapılamadı");
                }
              })
        } catch (error) {
            console.error('Logout işlemi sırasında bir hata oluştu:', error);
        }
    };
    
  
  return (
    <nav className="bg-gray-800 w-64 h-screen fixed top-0 left-0 overflow-y-auto">
      <div className="flex items-center h-16 border-b border-gray-700 pl-4 mt-4">
        <img src={NEULOGO} alt="logo" className="w-16 h-16 rounded-full mr-4 " />
        <span className="text-white text font-semibold">NEÜ YOKLAMA SİSTEMİ</span>
      </div>

      <ul className="mt-4">
        <li className="mb-2">
          <a href="#" className="flex items-center text-white px-6 py-2 hover:bg-gray-700" onClick={handleShowCards}>
            <FontAwesomeIcon icon={faBook} />
            <span className="ml-1">Dersler</span>
          </a>
        </li>
      </ul>

      <div className="absolute bottom-0 left-0 w-full border-t border-gray-700 py-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <FontAwesomeIcon icon={faUser} style={{ color: "white", fontSize: "34px" }} />

          <div className="text-white ml-2 font-semibold">
          <p className="text-sm">{studentNo}</p>
            <p className="text-sm">{name} {surname}</p>
            <p className="text-sm">{department}</p>
          </div>
        </div>
        <a href="#" className="text-white block" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span className="ml-1">Çıkış Yap</span>
        </a>
      </div>
    </nav>
  );
}

export default Sidebar;
