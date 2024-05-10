
// LoginPage.js
import React,{ useState } from 'react';
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useHistory } from 'react-router-dom';



const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    /*e.preventDefault();
    try {
      const response = await fetch('http://yourdjangoapi.com/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token
        
      } else {
        console.error('Login failed');
        // Handle errors such as invalid credentials
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }*/
    history.push('/workout-plans'); // Redirect to the workout plans page
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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