import React from 'react';

const Card = ({ imageUrl, heading, description }) => {
  return (
    <div className="w-60 p-2 bg-gray-800 rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl cursor-pointer mb-4">
      <img className="h-40 object-cover rounded-xl" src={imageUrl} alt="" />
      <div className="p-2">
        <h2 className="font-bold text-lg mb-2 text-white">{heading}</h2>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default Card;
