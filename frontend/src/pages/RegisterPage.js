import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    weight: '',
    height: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

const handleSubmit = (event) => {
  event.preventDefault();
  axios.post('http://localhost:8000/register/', formData)
    .then(response => {
      console.log('Registration successful:', response.data);
      if (response.status === 201) {
        history.push('/login'); // Redirect to login page after successful registration
      }
    })
    .catch(error => {
      console.error('Registration error:', error.response ? error.response.data : 'Server did not respond');
    });
};

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" style={{ margin: '20px 0', color: 'green' }}>
          FitChamp
        </Typography>
        <Paper elevation={6} style={{ padding: '20px', width: '100%' }}>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField margin="normal" required fullWidth label="Username" name="username" autoFocus value={formData.username} onChange={handleChange} />
            <TextField margin="normal" required fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="dateOfBirth" label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} value={formData.dateOfBirth} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="gender" label="Gender" value={formData.gender} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="weight" label="Weight" type="number" value={formData.weight} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="height" label="Height" type="number" value={formData.height} onChange={handleChange} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: 'green' }}>
              Register
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              sx={{ mt: 1, mb: 2 }}
              onClick={() => history.push('/trainer-signup')}
            >
              Sign up as a Trainer
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
