import React, { useState } from 'react';
import StudentModal from './StudentModal';

const Card = ({ imageUrl, heading, description }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  return (
    <div>
      <div className="relative w-60 p-2 bg-gray-800 rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl cursor-pointer mb-4" onClick={toggleModal}>
        <img className="h-40 object-cover rounded-xl" src={imageUrl} alt="" />
        <div className="p-2">
          <h2 className="font-bold text-lg mb-2 text-white">{heading}</h2>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </div>

    
      <StudentModal isOpen={showModal} onClose={toggleModal} heading={heading} />
    </div>
  );
};

export default Card;
