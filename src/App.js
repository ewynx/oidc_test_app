import React from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin, googleLogout, useGoogleOneTapLogin } from '@react-oauth/google';

const App = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await axios.post('http://localhost:3001/verify-token', { token });
      console.log('Verification response:', response.data);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: handleLoginSuccess,
    onError: () => console.log('Login failed'),
    clientId: "GOOGLE_CLIENT_ID", // Replace with your actual Google Client ID
  });

  return (
    <div className="App">
      <header className="App-header">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log('Login Failed')}
        />
        <button onClick={() => googleLogout()}>Logout</button>
      </header>
    </div>
  );
}

const Root = () => {
  return (
    <GoogleOAuthProvider clientId="GOOGLE_CLIENT_ID"> {/* Replace with your actual Google Client ID */}
      <App />
    </GoogleOAuthProvider>
  );
}

export default Root;
