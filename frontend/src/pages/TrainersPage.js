import React from 'react';
import { Grid, Paper, Avatar, Button, AppBar, Tabs, Tab, Box, Typography, IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';

const TrainersPage = () => {
  const history = useHistory();
  const trainers = [
    { id: 1, name: 'Trainer 1' },
    { id: 2, name: 'Trainer 2' }
    // Add more trainers as needed
  ];

  const handleSelectTrainer = (trainerId) => {
    history.push(`/trainer-profile/${trainerId}`);
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
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
        <Tabs 
            onChange={handleRouteChange} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              flexGrow: 1, 
              backgroundColor: 'black' // Set the background color for the whole tabs container
            }} 
            variant="fullWidth"
          > 
            <Tab 
              label="Workouts" 
              value="workout-plans" 
              sx={{ color: 'white', backgroundColor: 'black' }}
            />
            <Tab 
              label="Trainers" 
              value="trainers" 
              sx={{ color: 'black', backgroundColor: green[500]  }}
            />
            <Tab 
              label="Nutrition Plans" 
              value="nutrition" 
              sx={{ color: 'white', backgroundColor: 'black' }}
            />
            <Tab 
              label="Goals" 
              value="goals" 
              sx={{ color: 'white', backgroundColor: 'black' }}
            />
            <Tab 
              label="Progress" 
              value="progress" 
              sx={{ color: 'white', backgroundColor: 'black' }}
            />
          </Tabs>
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
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {trainers.map((trainer) => (
            <Grid item xs={12} sm={6} md={4} key={trainer.id}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }} onClick={() => handleSelectTrainer(trainer.id)}>
                <Avatar sx={{ width: 56, height: 56, margin: 'auto' }} />
                <Typography>{trainer.name}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TrainersPage;
