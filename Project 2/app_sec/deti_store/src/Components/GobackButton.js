import React from 'react';
import { useLocation } from 'react-router-dom';
import "../Css/GoBackButton.css";



function GoBackButton() {

    const location = useLocation();

    // Verifique se a localização atual é a homepage
    const isHomepage = location.pathname === '/';

    // Renderize o botão somente se não estiver na homepage
    if (isHomepage) {
        return null; // Renderiza nada se estiver na homepage
    }

    return (

        <button   onClick={() => window.history.back()} className="gobackbutton"><i className="animation"></i>	&larr; Go Back<i className="animation"></i></button>
    );
}

export default GoBackButton;




