import React from 'react';
import RegistrationForm from '../components/RegistrationForm';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';


const RegisterPage: React.FC = () => {
  const navigate =useNavigate()
  const handleRegister = async (username: string, email: string, password: string) => {
    // Implement your registration logic here
    const response =await registerUser({"username":username,"email":email,"password":password})

    if( response.status==200){
      navigate('/login')
      
    }

    if( response.status ==400){
      alert((await response.json()).detail)
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RegistrationForm onRegister={handleRegister} />
    </div>
  );
};

export default RegisterPage;
