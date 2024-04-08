import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const StudentPage = () => {
  const [no, setNo] = useState('')
  const navigate = useNavigate()
  axios.defaults.withCredentials = true
  useEffect(()=>{
    axios.get('http://localhost:9000/student/')

    .then(res => {
      console.log(res);
      if(res.data.valid){
        setNo(res.data.no)
      }else{
        navigate('/')
      }
    })
    .catch(err => console.log(err))
  })
  
  return (
    <div>
      StudentPage
      {no}
    </div>
  )
}

export default StudentPage