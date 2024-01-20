import React, { useState } from 'react';
import '../Css/Register.css'; 

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal,setShowFailureModal]=useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
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
        console.log('Registration successful');
      } else {
        setShowFailureModal(true)
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
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="success-modal">
          <p>Registration Successful!</p>
        </div>
      )}
      {showFailureModal && (
        <div className="failure-modal">
          <p>Invalid Credentials</p>
        </div>
      )}
    </div>
  );
}

export default Register;
