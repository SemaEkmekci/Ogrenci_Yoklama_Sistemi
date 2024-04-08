import React, { useState } from 'react';
import Instructor from './LoginInstructor';
import Student from './LoginStudent';

const Login = () => {
  const [showInstructor, setShowInstructor] = useState(true);

  return (
    <div className='bg-gray-300 min-h-screen flex flex-col items-center justify-center'>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <button 
            onClick={() => setShowInstructor(true)}
            className="w-full bg-[#002D74] hover:bg-[#FFF] text-white hover:text-[#002D74] font-bold py-2 px-4 rounded mb-4 border-2 border-blue-300 mr-2"
          >
            Akademisyen
          </button>

          <button 
            onClick={() => setShowInstructor(false)}
            className="w-full bg-[#002D74] hover:bg-[#FFF] text-white hover:text-[#002D74] font-bold py-2 px-4 rounded mb-4 border-2 border-blue-300 ml-2"
          >
            Öğrenci
          </button>
        </div>
      </div>
      <section className="ml-auto mr-auto">
        {showInstructor ? <Instructor /> : <Student />}
      </section>
    </div>
  );
};

export default Login;
