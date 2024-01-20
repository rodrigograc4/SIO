import React, { useState } from 'react';
import '../Css/Login.css'; 
import { useAuth } from '../Context/AuthContext';
import 'font-awesome/css/font-awesome.min.css';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login} = useAuth(); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);



  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (data.success) {
        setShowSuccessModal(true);
  
        setTimeout(async () => {
          setShowSuccessModal(false);
          const user_id = data.user_id;
          login(user_id);
          window.location.href = '/';
        }, 2000);
        console.log('Login successful');
      } else {
        setShowFailureModal(true)
        setTimeout(() => {
          setShowFailureModal(false);
        }, 3000);
        console.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Error while logging in:', error);
    }
  };
  
  

  return (
    <div className='login-page'>
      <div className='login-block'>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type='text'
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='password'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit'>Login</button>
          <a href="/changepassword">Forgot you password??</a>
       
        </form>

      </div>

      {showSuccessModal && (
        <div className="success-modal">
          <p>Login Successfully!</p>
        </div>
      )}

      {showFailureModal && (
              <div className="failure-modal">
                <p>Invalid credentials</p>
              </div>
            )}
    </div>
  );
}

export default Login;
