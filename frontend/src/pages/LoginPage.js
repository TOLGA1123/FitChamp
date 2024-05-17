// LoginPage.js
import React,{ useState } from 'react';
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';



const LoginPage = () => {
  const[formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const history = useHistory();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/login/', formData)
    .then(response => {
      console.log('Login successful:', response.data);
      if (response.status === 200) {
        history.push('/workout-plans'); // Redirect to login page after successful registration
      }
      if(response.status === 201){
        history.push('/trainees');
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
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'green' }}
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <Button
  type="button"
  fullWidth
  variant="outlined"
  sx={{ mt: 1, mb: 2 }}
  onClick={() => history.push('/register')}
>
  Sign Up
</Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;