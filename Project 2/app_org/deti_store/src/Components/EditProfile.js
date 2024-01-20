import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import "../Css/EditProfile.css";
import DOMPurify from 'dompurify';

function EditProfile() {
  const { user_id, userInfo, fetchUserInfo } = useAuth();
  const [editableInfo, setEditableInfo] = useState(null);

  const validateInput = (input) => {
    const sanitizedInput = input.replace(/[#$%^[&*(){}+=_?:/<>'";-]+/g, '');
    return sanitizedInput;
  };

  useEffect(() => {
      if (userInfo) {
          setEditableInfo({
              nome: userInfo.nome,
              email: userInfo.email,
              morada: userInfo.morada,
              codigoPostal: userInfo.codigoPostal,
              cidade: userInfo.cidade,
              contacto: userInfo.Ntelemovel
          });
      }
  }, [userInfo]);

  if (!editableInfo) {
      return <div>Loading...</div>;
  }



const saveChanges = async () => {
  console.log(user_id);
  console.log(editableInfo);
  try {
      const response = await fetch('http://localhost:5000/api/editprofile', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              id: user_id,
              ...editableInfo,
          }),
      });

      if (response.ok) {
          const updatedInfo = await response.json();
          fetchUserInfo(user_id);
          console.log(updatedInfo);

          document.body.classList.add('modal-open');
          const successModal = document.getElementById("success-modal");
          successModal.style.display = "block";

          
          setTimeout(() => {
              
              document.body.classList.remove('modal-open');
              window.location.href = '/profile';
          }, 3000);
      } else {
          console.error('Erro ao atualizar o perfil');
      }
  } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
  }
}




  const resetFields = () => {
      setEditableInfo({
          nome: userInfo.nome,
          email: userInfo.email,
          morada: userInfo.morada,
          codigoPostal: userInfo.codigoPostal,
          cidade: userInfo.cidade,
          contacto: userInfo.Ntelemovel
      });
  }
  return (
    <div className='edit-profile-page'>
      <div className="edit-profile-modal">
        <h3>Edit Your Profile</h3>
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" />
        <div className="form-row" style={{ marginTop: '1rem' }}>
  <p>Nome:</p>
  <input
    type="text"
    value={editableInfo.nome || ''}
    onChange={(e) => setEditableInfo({ ...editableInfo, nome: DOMPurify.sanitize(e.target.value) })}
  />
</div>
<div className="form-row">
  <p>Email:</p>
  <input
    type="email"
    value={editableInfo.email || ''}
    onChange={(e) => setEditableInfo({ ...editableInfo, email: DOMPurify.sanitize(e.target.value) })}
  />
</div>
<div className="form-row">
  <p>Rua:</p>
  <input
    type="text"
    value={editableInfo.morada || ''}
    onChange={(e) => setEditableInfo({ ...editableInfo, morada: DOMPurify.sanitize(e.target.value) })}
  />
</div>
<div className="form-row">
  <p>Código Postal:</p>
  <input
    type="text"
    value={editableInfo.codigoPostal || ''}
    onChange={(e) => setEditableInfo({ ...editableInfo, codigoPostal: DOMPurify.sanitize(e.target.value) })}
  />
</div>
<div className="form-row">
  <p>Cidade:</p>
  <input
    type="text"
    value={editableInfo.cidade || ''}
    onChange={(e) => setEditableInfo({ ...editableInfo, cidade: DOMPurify.sanitize(e.target.value) })}
  />
</div>
<div className="form-row">
  <p>Contacto:</p>
  <input
    type="text"
    value={editableInfo.contacto || ''}
    onChange={(e) => setEditableInfo({ ...editableInfo, contacto: DOMPurify.sanitize(e.target.value) })}
  />
</div>
<div className="form-row">
          <button className="btn edit-button" onClick={saveChanges}><i className="animation"></i>Save Changes<i className="animation"></i></button>
          <button className="btn edit-button" onClick={resetFields}><i className="animation"></i>Reset Fields<i className="animation"></i></button>
        </div>
      </div>
  

    
          <div className="info-saved-modal" id="success-modal" style={{ display: 'none' }}>
              <p>Changes saved</p>
          </div>
    </div>
  );
}

export default EditProfile;



               







