// TrainerSignUp.js
import { Container, TextField, Button } from '@mui/material';
import React from 'react';
import { Box, Grid, Paper, Typography, Avatar, List, ListItem, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';

const TrainerSignUp = () => {
  const history = useHistory();

  const handleTraineeSignUp = () => {
    history.push('/register');
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
          <Typography component="h2" variant="h6" style={{ margin: '10px 0', color: 'green' }}>
            Trainer Sign Up
          </Typography>
        </Typography>
        <Paper elevation={6} style={{ padding: '20px', width: '100%' }}>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth label="Username" name="username" autoFocus />
            <TextField margin="normal" required fullWidth label="Email Address" name="email" />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" />
            <TextField margin="normal" required fullWidth label="Specialization" name="specialization" />
            <TextField margin="normal" required fullWidth label="Phone Number" name="phone" />
            <TextField margin="normal" required fullWidth label="Social Media" name="socialMedia" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: 'green' }}>
              Register
            </Button>
            <Button fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={handleTraineeSignUp}>
              Sign up as a Trainee
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TrainerSignUp;