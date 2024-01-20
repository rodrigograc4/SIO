import React from 'react';
import '../Css/Profile.css';
import { useAuth } from '../Context/AuthContext';

const Profile = () => {
    const { userInfo} = useAuth();


    if (userInfo === null) {
      
      return <div>Loading...</div>;
    }
  
    return (
        <div className='profile-page'>
            <div className="profile-modal">
            <div className="modal-content">
                <div className="left-column">
                    <div className="profile-image">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" />
                    </div>
                    <div className="buttons">
                        <button className="btn" onClick={() => window.location.href = "/myorders"}><i className="animation"></i>View My Orders<i className="animation"></i></button>
                        <button className="btn" onClick={() => window.location.href = "/store"}><i className="animation"></i>Go Shopping<i className="animation"></i></button>
                    </div>
                </div>
                <div className="right-column">
                    <span>Profile<br/>{userInfo.username}</span>
                    <div className="profile-info">
                        <h3>Name:{userInfo.nome}</h3>
                        <p>Email: {userInfo.email}</p>
                        <p>Rua: {userInfo.morada}</p>
                        <p>Codigo-Postal: {userInfo.codigoPostal}</p>
                        <p>Cidade:  {userInfo.cidade}</p>
                        <p>Contacto:{userInfo.Ntelemovel}</p>
                    </div>
                    <button className="btn edit-button" onClick={() => window.location.href = "/editprofile"}><i className="animation"></i>Edit My Profile<i className="animation"></i></button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Profile;
