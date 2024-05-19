// components/LogoutButton.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

const LogoutButton = () => {
  const history = useHistory();

  const handleLogout = () => {
    axios.post('http://localhost:8000/logout/')
      .then(response => {
        console.log('Logout successful:', response.data);
        history.push('/'); // Redirect to login page after successful logout
      })
      .catch(error => {
        console.error('Logout error:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
