// RegisterPage.js
import React from 'react';
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useHistory } from 'react-router-dom';

const RegisterPage = () => {
  const history = useHistory();
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
            <TextField margin="normal" required fullWidth label="Username" name="username" autoFocus />
            <TextField margin="normal" required fullWidth label="Email Address" name="email" />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" />
            <TextField margin="normal" required fullWidth name="dateOfBirth" label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} />
            <TextField margin="normal" required fullWidth name="gender" label="Gender" />
            <TextField margin="normal" required fullWidth name="weight" label="Weight" type="number" />
            <TextField margin="normal" required fullWidth name="height" label="Height" type="number" />
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