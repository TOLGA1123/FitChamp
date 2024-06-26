import React from 'react';
import { Grid, Paper, Avatar, Button, AppBar, Tabs, Tab, Box, Typography, IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';
import NavTabs from './NavTabs';

const TrainersPage = () => {
  const history = useHistory();
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    // Fetch trainers associated with the current user from the backend
    axios.get('http://localhost:8000/trainers/')
      .then(response => {
        setTrainers(response.data);
      })
      .catch(error => {
        console.error('Error fetching trainers:', error.response ? error.response.data : 'Server did not respond');
      });
  }, []);

  const handleSelectTrainer = (trainerId) => {
    history.push(`/trainer/${trainerId.trim()}`);
  };

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleNewTrainer = () => {
    history.push('/new-trainer');
  };

  const handleGroupSession = () => {
    history.push('/group-session');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <NavTabs activeTab="trainers" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Your Trainers
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleNewTrainer}>
            <AddCircleOutlineIcon />
            <Typography variant="button">New Trainer</Typography>
          </IconButton>
          <LogoutButton />
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
  <Grid container spacing={2}>
    {trainers.map((trainer) => (
      <Grid item xs={12} sm={6} md={4} key={trainer.id}>
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }} onClick={() => handleSelectTrainer(trainer.trainer_id)}>
          <Avatar alt={trainer.user_name} src={`data:image/jpeg;base64,${trainer.profile_picture}`} sx={{ width: 100, height: 100, margin: 'auto' }} />
          <Typography variant="h6" sx={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Trainer Name: {trainer.user_name}</Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Specialization: {trainer.specialization}</Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>Telephone Number: {trainer.telephone_number}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
</Box>
</Box>
  );
};

export default TrainersPage;
