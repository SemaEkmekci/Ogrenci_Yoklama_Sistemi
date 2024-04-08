import React, { useEffect, useState } from 'react';


const RFID = () => {
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:9000/student/info');
          const data = await response.text();
          setResponseData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <h1>GET Request Response</h1>
        {responseData && <p>{responseData}</p>}
      </div>
    );
}

export default RFID