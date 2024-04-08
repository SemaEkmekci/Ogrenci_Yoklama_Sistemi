import React, { useEffect, useState } from 'react';
import {RFID} from '../services/RFID';
import Login from '../components/Login';



const MainPage = () => {

  const [IDInfo, setIDInfo] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await RFID();
        setIDInfo(Array.isArray(data) ? data : [data]);
        console.log('Api Data:', data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      {IDInfo}
      <Login/>
    </div>
  )
}

export default MainPage;