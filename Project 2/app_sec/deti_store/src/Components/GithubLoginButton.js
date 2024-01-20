// GitHubLoginButton.js
import React from 'react';



const GitHubLoginButton = () => {
  const handleGitHubLogin = async () => {
    try {
      // Redirect the user to the GitHub OAuth authorization URL
      window.location.href = `https://github.com/login/oauth/authorize?client_id=0f540b0a747d0921412c&redirect_uri=http://localhost:5000/api/profile&scope=read:user`;
    } catch (error) {
      console.error('Error initiating GitHub login:', error);
    }
  };

  return (
    <button onClick={handleGitHubLogin}>
      Login with GitHub
    </button>
  );
};

export default GitHubLoginButton;