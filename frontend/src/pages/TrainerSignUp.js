
// TrainerSignUp.js
import { Container, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Avatar, List, ListItem, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';
import axios from 'axios';
const TrainerSignUp = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    specialization: '',
    phone: '',
    socialMedia: ''
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
    axios.post('http://localhost:8000/trainer-signup/', formData)
      .then(response => {
        console.log('Registration successful:', response.data);
        if (response.status === 201) {
          history.push('/'); // Redirect to login page after successful registration
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
            <TextField margin="normal" required fullWidth label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
            <TextField margin="normal" required fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            <TextField margin="normal" required fullWidth label="Social Media" name="socialMedia" value={formData.socialMedia} onChange={handleChange} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: 'green' }}>
              Register
            </Button>
            <Button  type="button"
              fullWidth
              variant="outlined"
              sx={{ mt: 1, mb: 2 }}
              onClick={() => history.push('/register')}
            >
              Sign up as a Trainee
            </Button>
            <Button  type="button"
              fullWidth
              variant="outlined"
              sx={{ mt: 1, mb: 2 }}
              onClick={() => history.push('/')}
            >
              Log In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TrainerSignUp;
