import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';
import MessageIcon from '@mui/icons-material/Message';
import LogoutButton from './LogoutButton';
import NavTabs from './NavTabs';
// Define a class for workout plans
class WorkoutPlan {
  constructor(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
  }
}

// Create an array of workout plans
const workoutPlans = [
  new WorkoutPlan(1, 'Workout 1', 'Description of Workout 1'),
  new WorkoutPlan(2, 'Workout 2', 'Description of Workout 2'),
  new WorkoutPlan(3, 'Workout 3', 'Description of Workout 3')
];

const CurrentWorkoutPlans = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState('');


  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleNewWorkout = () => {
    history.push('/new-workout');
  };

  const handleGroupSession = () => {
    history.push('/group-session');
  };
  const handleMSGClick = () => {
    history.push('/messages');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <NavTabs activeTab="workout-plans" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}><PersonIcon /></IconButton>
          <IconButton sx={{ position: 'absolute', left: 150 }} onClick={handleGroupSession}><GroupIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Current Workout Plans
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleNewWorkout}>
            <AddCircleOutlineIcon /><Typography variant="button">New Workout</Typography>
          </IconButton>        
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
          <LogoutButton />
        </Box>

      </AppBar>

      {/* Map workout plans to display */}
      {workoutPlans.map((plan) => (
        <Paper key={plan.id} elevation={3} sx={{ margin: 2, padding: 2 }}>
          <Typography variant="h6">{plan.title}</Typography>
          <Typography>{plan.description}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default CurrentWorkoutPlans;
