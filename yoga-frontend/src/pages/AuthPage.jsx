import React, { useState } from 'react';
import RegisterForm from '../components/Register';
import LoginForm from '../components/login';
import '../pages/CSS/reglogin.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "20px" }}>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Go to Register" : "Go to Login"}
      </button>
      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthPage;
