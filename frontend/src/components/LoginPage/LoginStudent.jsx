import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import NEULOGO from '../../assets/NEULogo.png'
import axios from 'axios'

const LoginInstructor = () => {
    
  const [fillColor, setFillColor] = useState('gray');
  const [typePassword, settypePassword] = useState('password');
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleMouseEnter = () => {
    setFillColor('black');
    settypePassword('text');
  };

  const handleMouseLeave = () => {
    setFillColor('gray');
    settypePassword('password');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };
  
  
  axios.defaults.withCredentials = true
  const handleLogin = async () => {
    console.log(studentNumber);
    try {
      await axios.post('http://localhost:9000/student/login', {
        studentNumber: studentNumber,
        password: password,
      }).then(res => {
        if(res.data.success){
          navigate('/student')
        }
        else{
          alert("Kayıt yok")
        }
        console.log(res);
      })

      
      // if (response.ok) {
      //   const data = await response.json();
      //   console.log(data);
      //   if(data.success){
      //     // window.location.href = '/student';
      //     navigate('/student')
      //     // fetchData();
      //   }
      // }
      // else {
      //   console.error('Failed to login:', response.status);
      // }
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    
    <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
      <div className="md:block hidden w-1/2">
      
      <img src={NEULOGO} alt="" className="rounded-2xl w-60 h-60" />

    </div>
      <div className="px-8 md:px-12">
        <h2 className="font-bold text-2xl text-[#002D74]">Öğrenci</h2>
        <p className="text-xs mt-4 text-[#002D74]">NEÜ YOKLAMA SİSTEMİ</p>
        <form  className="flex flex-col gap-4">
          <input 
          className="p-2 mt-8 rounded-xl border border-gray-400" 
          type="text" 
          name="studentNumber" 
          placeholder="Öğrenci No"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          />

          <div className="relative">
            <input 
            className="p-2 rounded-xl border border-gray-400 w-full" 
            type={typePassword} 
            name="password" 
            placeholder="Tek Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            />
            <button type="button">
            <svg  width="16" height="16" fill={fillColor} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16" >
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
            </svg>
            </button>
          </div>
          <button 
          className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300" 
          type="button"
          onClick={handleLogin}
          >
          Giriş Yap
          </button>
        </form>
       
      
        {/* <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
          <a href="#">Forgot your password?</a>
        </div>
      */}
      </div>
      
    </div>

  )
}

export default LoginInstructor