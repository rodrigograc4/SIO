import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user_id, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
      setUserId(token); // Set user_id from the stored token

      fetchUserInfo(token); // Fetch user info when logged in
    }
  }, []);

  const login = (user_id) => {
    setIsLoggedIn(true);
    setUserId(user_id);
    localStorage.setItem('authToken', user_id);
    fetchUserInfo(user_id);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null); // Clear user_id
    setUserInfo(null); // Clear user info
    localStorage.removeItem('authToken');
  };

  async function fetchUserInfo(user_id) {
    try {
      const response = await fetch(`http://localhost:5000/api/loggeduser/${user_id}`);
      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
      } else {
        console.error('Erro ao buscar informações do usuário:', response.status);
      }
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
    }
  }

 const [user, setUser] = useState(null);
 // Este useEffect só deve ser executado uma vez, quando o componente é montado
  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
  };

  const contextValue = {
    user,
    updateUserInfo,
    
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, user_id, userInfo, login, logout, fetchUserInfo,contextValue }}>
      {children}
    </AuthContext.Provider>
  );
}


