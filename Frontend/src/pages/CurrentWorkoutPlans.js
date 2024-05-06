import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';

const CurrentWorkoutPlans = () => {
  const history = useHistory();

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleNewWorkout = () => {
    history.push('/new-workout');
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
            sx={{ 
              color:'black', 
              backgroundColor: green[500]  
            }}
          />
          <Tab 
            label="Trainers" 
            value="trainers" 
            sx={{ color: 'white', backgroundColor: 'black' }}
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
          <IconButton sx={{ position: 'absolute', left: 150 }}onClick={handleGroupSession}>
            <GroupIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Current Workout Plans
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }}color="inherit" onClick={handleNewWorkout}>
            <AddCircleOutlineIcon />
            <Typography variant="button">New Workout</Typography>
          </IconButton>
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleProfileClick}>
            <FitnessCenterIcon />
          </IconButton>
        </Box>
      </AppBar>

      {/* This is where the workout plan items will go */}
      <Paper elevation={3} sx={{ margin: 2, padding: 2 }}>
        <Typography variant="h6">Workout 1</Typography>
        {/* Add more details and styles as needed */}
      </Paper>
      <Paper elevation={3} sx={{ margin: 2, padding: 2 }}>
        <Typography variant="h6">Workout 2</Typography>
        {/* Add more details and styles as needed */}
      </Paper>
    </Box>
  );
};

export default CurrentWorkoutPlans;
