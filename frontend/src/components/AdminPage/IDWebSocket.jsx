import { useState, useEffect } from 'react';

const IDWebSocket = (url, shouldConnect) => {
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    if (shouldConnect) {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setUserID(data.userID);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
      };

      return () => {
        setUserID(null);
        socket.close();
      };
    }
  }, [url, shouldConnect]);

  return userID;
};

export default IDWebSocket;
