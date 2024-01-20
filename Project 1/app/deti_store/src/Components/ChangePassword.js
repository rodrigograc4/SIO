import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import "../Css/ChangePassword.css";

function ChangePassword() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChangingPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      console.error('As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        body: JSON.stringify({ username, newPassword }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          window.location.href="/login"
        }, 2000);
        console.log('Senha redefinida com sucesso');
      } else {
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
        <form onSubmit={handleChangingPassword}>
          <input
            type='text'
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='password'
            value={newPassword}
            placeholder='New Password'
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type='password'
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type='submit'>Change</button>
        </form>
      </div>
      {showSuccessModal && (
        <div className="success-modal-resetpass">
          <p>Password Changed</p>
        </div>
      )}
    </div>
  );
}

export default ChangePassword;

