import React, { useState } from 'react';
import '../Css/Register.css'; 
import DOMPurify from 'dompurify';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  const sanitizedUsername = DOMPurify.sanitize(username);
  const sanitizedEmail = DOMPurify.sanitize(email);

  const validateInput = (input) => {
    const sanitizedInput = input.replace(/[#$%^[&*(){}+=_?:/<>'";-]+/g, '');
    return sanitizedInput;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const sanitizedPassword = validateInput(password);

    if (
      sanitizedUsername !== username ||
      sanitizedEmail !== email ||
      sanitizedPassword !== password ||
      !validatePassword(sanitizedPassword)
    ) {
      setShowFailureModal(true);
      setTimeout(() => {
        setShowFailureModal(false);
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

      if (data.success) {
        setShowSuccessModal(true);
        console.log('Registration successful');
        setTimeout(() => {
          setShowSuccessModal(false);
          window.location.href="/login"
        }, 2000);
      } else {
        setShowFailureModal(true);
        setTimeout(() => {
          setShowFailureModal(false);
        }, 3000);
        console.error('Registration failed');
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
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(validateInput(e.target.value))}
          />
          <button type="submit">Register</button>
        </form>
      </div>
      <div className='register-pass-block'>
        <ul>
          <li><p>Password must have at least 8 characters.</p></li>
          <li><p>Password must contain at least one uppercase letter.</p></li>
          <li><p>Password must have at least a number.</p></li>
          <li><p>Only "." or "!" is accepted as special characters.</p></li>
        </ul>
      </div>

      {showSuccessModal && (
        <div className="success-modal">
          <p>Registration Successful!</p>
        </div>
      )}
      {showFailureModal && (
        <div className="failure-modal">
          <p>Invalid Input or Password</p>
        </div>
      )}
    </div>
  );
}

export default Register;
