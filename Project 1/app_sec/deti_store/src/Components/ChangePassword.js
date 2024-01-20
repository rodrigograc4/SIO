import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import "../Css/ChangePassword.css";
import DOMPurify from 'dompurify';

function ChangePassword() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const validateInput = (input) => {
    const sanitizedInput = DOMPurify.sanitize(input);
    return sanitizedInput;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangingPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      console.error('As senhas não coincidem');
      return;
    }

    const sanitizedUsername = validateInput(username);
    const sanitizedNewPassword = validateInput(newPassword);
    const sanitizedConfirmPassword = validateInput(confirmPassword);

    if (
      sanitizedNewPassword !== newPassword ||
      sanitizedConfirmPassword !== confirmPassword ||
      !validatePassword(sanitizedNewPassword)
    ) {
      setShowFailureModal(true);
      setTimeout(() => {
        setShowFailureModal(false);
      }, 3000);
      console.error('Invalid input or password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        body: JSON.stringify({ username: sanitizedUsername, newPassword: sanitizedNewPassword }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          window.location.href = "/login";
        }, 2000);
        console.log('Senha redefinida com sucesso');
      } else {
        setShowFailureModal(true);
        setTimeout(() => {
          setShowFailureModal(false);
        }, 3000);
        console.error('Falha ao redefinir a senha:', data.error);
      }
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
    }
  };

  return (
    <div className='change-pass-page'>
      <div className='login-block'>
        <h1>Change your Password</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type='text'
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(validateInput(e.target.value))}
          />
          <input
            type='password'
            value={newPassword}
            placeholder='New Password'
            onChange={(e) => setNewPassword(validateInput(e.target.value))}
          />
          <input
            type='password'
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(validateInput(e.target.value))}
          />
          <button onClick={() => setIsConfirmationModalOpen(true)}>Change</button>
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
          <p>Password Changed</p>
        </div>
      )}
      {showFailureModal && (
        <div className="failure-modal">
          <p>Invalid Input or Password</p>
        </div>
      )}
      {isConfirmationModalOpen && (
        <div className="modal-background-change">
          <div className="modal-content-change">
            <h2>Confirm Password Change</h2>
            <p>Insert the code that was sent to your email to confirm</p>
            <input
            type="number"
           
          />
            <button className='changebutton' onClick={handleChangingPassword}>Confirm</button>
            <button className='changebutton' onClick={() => setIsConfirmationModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangePassword;


