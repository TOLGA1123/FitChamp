import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Snackbar, Alert } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const LogoutButton = () => {
  const [successMessage, setSuccessMessage] = useState(false);
  const history = useHistory();

  const handleLogout = () => {
    axios.post('http://localhost:8000/logout/')
      .then(response => {
        console.log('Logout successful:', response.data);
        setSuccessMessage(true); // Show success message
        setTimeout(() => {
          history.push('/'); // Redirect to login page after successful logout
        }, 1000);
      })
      .catch(error => {
        console.error('Logout error:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        startIcon={<ExitToAppIcon sx={{ color: 'gray' }} />}
      >
        Logout
      </Button>
      <Snackbar
        open={successMessage}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Logout successful!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LogoutButton;
