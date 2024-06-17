import React from 'react';
import LoginForm from '../components/LoginForm';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



const LoginPage: React.FC = () => {
  const {login}=useAuth()
  const navigate=useNavigate()
  const handleLogin =async (username: string, password: string) => {

    const response =await loginUser({"username":username,"password":password})

    if( response.status==200){
      const token =JSON.stringify((await response.json()).access_token)
      login(token)
      navigate('/prediction')
      
    }

    if( response.status ==400){
      alert((await response.json()).detail)
    }


   

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
