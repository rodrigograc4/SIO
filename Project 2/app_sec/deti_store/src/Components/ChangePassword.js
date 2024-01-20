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
  const [failureMessage, setFailureMessage] = useState('');

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


const toggleNewPasswordVisibility = () => {
  setIsNewPasswordVisible(!isNewPasswordVisible);
  setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
};


const hasMinLength = password => password.length >= 12;

const passwordChecks = [
  { check: hasMinLength, message: "Password must have at least 12 characters." },
  { check: (password) => password === confirmPassword, message: "Passwords must match." }
];

  const handleFailureModal = (show, message = '') => {
    setShowFailureModal(show);
    setFailureMessage(message);
  };

  const validateInput = (input) => {
    const sanitizedInput = DOMPurify.sanitize(input);
    return sanitizedInput;
  };

  const validatePassword = (newPassword) => {
    return hasMinLength(newPassword);
  };
  

  const handleChangingPassword = async (e) => {
    e.preventDefault();

    const sanitizedUsername = validateInput(username);
    const sanitizedNewPassword = validateInput(newPassword);
    const sanitizedConfirmPassword = validateInput(confirmPassword);

    if (!validatePassword(sanitizedNewPassword)) {
      handleFailureModal(true, 'Invalid input or password');
      setTimeout(() => handleFailureModal(false), 3000);
      console.error('Invalid input or password');
      return;
    }

    if (
      sanitizedNewPassword !== newPassword ||
      sanitizedConfirmPassword !== confirmPassword ||
      !validatePassword(sanitizedNewPassword)
    ) {
      handleFailureModal(true, 'Invalid input or password');
      setTimeout(() => handleFailureModal(false), 3000);
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

      if (response.ok && data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          window.location.href = "/login";
        }, 2000);
        console.log('Senha redefinida com sucesso');
      } else {
        const errorMessage = data.error || 'Falha ao redefinir a senha';
        handleFailureModal(true, errorMessage);
        setTimeout(() => handleFailureModal(false), 3000);
        console.error('Falha ao redefinir a senha:', errorMessage);
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
            type={isNewPasswordVisible ? "text" : "password"}
            value={newPassword}
            placeholder="New Password"
            onChange={(e) => setNewPassword(validateInput(e.target.value))}
            autoComplete="current-password"
          />
              <input
          type={isConfirmPasswordVisible ? "text" : "password"}
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(validateInput(e.target.value))}
          autoComplete="current-password"
        />
        <button type="button"  style={{"marginBottom":"1rem"}} onClick={toggleNewPasswordVisibility}>
      {isNewPasswordVisible ? 'Hide Pass' : 'Show Pass'}
    </button>
          <button onClick={() => setIsConfirmationModalOpen(true)}>Change</button>
        </form>
      </div>
      <div className='register-pass-block'>
        <ul>
          {passwordChecks.map(({ check, message }) => (
            <li key={message} className={check(newPassword) ? 'valid' : ''}>
              <p>{message}</p>
            </li>
          ))}cd ..
        </ul>
      </div>
      {showSuccessModal && (
        <div className="success-modal">
          <p>Password Changed</p>
        </div>
      )}
      {showFailureModal && (
        <div className="failure-modal">
          <p>{failureMessage}</p>
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


