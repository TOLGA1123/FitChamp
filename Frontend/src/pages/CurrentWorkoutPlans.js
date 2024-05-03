import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';


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
      <AppBar position="static">
        <Tabs onChange={handleRouteChange} aria-label="simple tabs example" justifyContent="space-between"  > 
          <Tab label="Workouts" value="" />
          <Tab label="Trainers" value="trainers" />
          <Tab label="Nutrition Plans" value="nutrition" />
          <Tab label="Goals" value="goals" />
          <Tab label="Progress" value="progress" />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
          <IconButton onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <IconButton onClick={handleGroupSession}>
            <GroupIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Current Workout Plans
          </Typography>
          <IconButton color="inherit" onClick={handleNewWorkout}>
            <AddCircleOutlineIcon />
            <Typography variant="button">New Workout</Typography>
          </IconButton>
          <IconButton onClick={handleProfileClick}>
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