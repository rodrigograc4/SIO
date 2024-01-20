import React, { useState } from 'react';
import '../Css/Login.css';
import { useAuth } from '../Context/AuthContext';
import 'font-awesome/css/font-awesome.min.css';
import DOMPurify from 'dompurify';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showPasswordExpiredMessage, setShowPasswordExpiredMessage] = useState(false);


  const sanitizedUsername = DOMPurify.sanitize(username);
  const sanitizedPassword = DOMPurify.sanitize(password);

  const validateInput = (input) => {
    const sanitizedInput = input.replace(/[#$%^[&*(){}+=_?:/<>'";-]+/g, '');
    return sanitizedInput;
  };

  const validatecharacter= (input) =>{
    const sanitizedchar = input.replace(/[<]+/g,'');
    return sanitizedchar
  };

  const checkPasswordExpiration = async () => {

    const validatedUsername =sanitizedUsername
    const validatedPassword = validateInput(sanitizedPassword);
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        body: JSON.stringify({ username: validatedUsername, password: validatedPassword }),
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
        setShowFailureModal(true);

        if (data.error === 'A senha expirou. Altere sua senha.') {
          setShowPasswordExpiredMessage(true);
          setTimeout(() => {
            setShowPasswordExpiredMessage(false);
            window.location.href = '/changepassword';
          }, 3000);
        }

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
        <form>
          <input
            type='text'
            value={sanitizedUsername}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='password'
            value={sanitizedPassword}
            placeholder='Password'
            onChange={(e) =>  setPassword(e.target.value)}
          />
          <button type='button' onClick={checkPasswordExpiration}>Login</button>
          <a href="/changepassword">Forgot your password??</a>
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

      {showPasswordExpiredMessage && (
        <div className="failure-modal">
          <p>Your password has expired. Please change your password.</p>
        </div>
      )}
    </div>
  );
}

export default Login;

