import React, { useState } from 'react';
import '../Css/Register.css'; 
import DOMPurify from 'dompurify';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);



  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

const hasMinLength = password => password.length >= 12;
const hasUppercase = password => /[A-Z]/.test(password);
const hasNumber = password => /\d/.test(password);
const hasValidSpecialChars = password => /^[A-Za-z0-9.!]*$/.test(password);



const passwordChecks = [
  { check: hasMinLength, message: "Password must have at least 12 characters." },
];


  const sanitizedUsername = DOMPurify.sanitize(username);
  const sanitizedEmail = DOMPurify.sanitize(email);

  const handleFailureModal = (show, message = '') => {
    setShowFailure(show);
    setFailureMessage(message);
  };

  const validateInput = (input) => {
    const sanitizedInput = input.replace(/[#$%^[&*(){}+=_?:/<>'";-]+/g, '');
    return sanitizedInput;
  };

  const validatePassword = (password) => {
    return hasMinLength(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const sanitizedPassword = validateInput(password);

    const usernameBeforeAtSymbol = sanitizedEmail.split('@')[0];
    console.log('Username before @:', usernameBeforeAtSymbol);

    let errorMessage = '';
    if (sanitizedUsername !== username || sanitizedEmail !== email) {
      errorMessage = 'Invalid username or email input.';
    } else if (!validatePassword(sanitizedPassword)) {
      errorMessage = 'Invalid password. Please ensure it meets the requirements.';
    } else if (username === '' || email === '' || username === 'sa' || username === 'root' || username === 'admin' || username === 'administrator' || usernameBeforeAtSymbol === 'sa' || usernameBeforeAtSymbol === 'root' || usernameBeforeAtSymbol === 'admin' || usernameBeforeAtSymbol === 'administrator') {
      errorMessage = 'Invalid username or email input.';
    }
  
    if (errorMessage) {
      handleFailureModal(true, errorMessage);
      setTimeout(() => {
        handleFailureModal(false);
      }, 3000);
      console.error('Invalid input or password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: JSON.stringify({ username: sanitizedUsername, email: sanitizedEmail, password: sanitizedPassword }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowSuccessModal(true);
        console.log('Registration successful');
        setTimeout(() => {
          setShowSuccessModal(false);
          window.location.href="/login"
        }, 2000);
      } else {
        const errorMessage = data.error || 'Registration failed'; 
        handleFailureModal(true, errorMessage);
        setTimeout(() => {
          handleFailureModal(false);
        }, 3000);
        console.error('Registration failed:', errorMessage);
           
      }
    } catch (error) {
      console.error('Error while registering:', error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-block">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={sanitizedUsername}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            value={sanitizedEmail}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
         <input
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(validateInput(e.target.value))}
          />
          <button type="button" style={{"marginBottom":"1rem"}} onClick={togglePasswordVisibility}>
            {isPasswordVisible ? 'Hide Pass' : 'Show Pass'}
          </button>
          <button type="submit">Register</button>
        </form>
      </div>
      <div className='register-pass-block'>
        <ul>
          {passwordChecks.map(({ check, message }) => (
           <li key={message} className={check(password) ? 'valid' : ''}>
           <p>{message}</p>
         </li>
          ))}
        </ul>
      </div>

      {showSuccessModal && (
        <div className="success-modal">
          <p>Registration Successful!</p>
        </div>
      )}
      {showFailure && (
        <div className="failure-modal">
          <p>{failureMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Register;
