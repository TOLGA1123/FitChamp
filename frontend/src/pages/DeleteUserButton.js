import React, { useState } from 'react';
import axios from 'axios';

const DeleteUserButton = ({ userId, onDelete }) => {
  const handleDelete = () => {
    axios.delete(`http://localhost:8000/delete-user/${userId}/`)
      .then(response => {
        console.log('User deleted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error deleting user:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  return (
    <button onClick={handleDelete}>Delete Account</button>
  );
};

export default DeleteUserButton;
