import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'test@example.com' && password === 'password123') {
      alert('Login Successful!');
      navigate('/semester-registration'); // Redirect to the semester registration page
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to the registration page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <button className="register-btn" onClick={handleRegisterClick}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
