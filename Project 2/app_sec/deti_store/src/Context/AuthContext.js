import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [user_id, setUserId] = useState(null);


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/authstatus', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data.auth) {
          setIsLoggedIn(true);
          fetchUserInfo(data.userId);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };
  
  async function fetchUserInfo(user_id) {
    const url = `http://localhost:5000/api/loggeduser/${user_id}`;
    try {
      const response = await fetch(url, { credentials: 'include' });
     
      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
      } else {
        console.error('Error fetching user info:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const login = async (user_id) => {
    try {
      await fetchUserInfo(user_id);
      setIsLoggedIn(true);
      setUserId(user_id);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    console.log("Logging Out!")
    try {
      await fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setUserId(null);
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const contextValue = {
    login,
    isLoggedIn,
    userInfo,
    logout,
    user_id,
    checkAuthStatus,
    fetchUserInfo
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
