import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';
import MessageIcon from '@mui/icons-material/Message';
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

  const handleRouteChange = (event, newValue) => {
    setSelectedTab(newValue);
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
  const handleMSGClick = () => {
    history.push('/messages');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
        <Tabs 
          value={selectedTab}
          onChange={handleRouteChange} 
          sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, backgroundColor: 'black' }} 
          variant="fullWidth"
        >
          <Tab label="Workouts" value="workout-plans" sx={{ color: 'black', backgroundColor: green[500] }} />
          <Tab label="Trainers" value="trainers" sx={{ color: 'white', backgroundColor: 'black' }} />
          <Tab label="Nutrition Plans" value="nutrition" sx={{ color: 'white', backgroundColor: 'black' }} />
          <Tab label="Goals" value="goals" sx={{ color: 'white', backgroundColor: 'black' }} />
          <Tab label="Achievements" value="achievements" sx={{ color: 'white', backgroundColor: 'black' }} />
        </Tabs>
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