import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Grid, Paper, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import {Avatar, List, ListItem, ListItemText } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';

const NewWorkoutPlan = () => {
  const history = useHistory();
  const [workoutPlan, setWorkoutPlan] = useState({
    routineName: '',
    duration: '',
    difficulty: '',
    description: []
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setWorkoutPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value
    }));
  };
  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const addDescription = () => {
    // This function would ideally open a modal or another input method to add exercise details
    setWorkoutPlan((prevPlan) => ({
      ...prevPlan,
      description: [...prevPlan.description, "New Exercise Detail"]
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting New Workout Plan:', workoutPlan);
    // Implement submit logic, possibly making a POST request to your backend
    history.push('/workout-plans'); // Redirect to the workout plans overview
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" sx={{backgroundColor: green[500]}} >
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

        <Tab label="Achievements" value="achievements" sx={{ color: 'white', backgroundColor: 'black' }} />
      </Tabs>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
        <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
          <PersonIcon />
        </IconButton>

        <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          Create a Workout Plan
        </Typography>
      </Box>
    </AppBar>
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Routine Name"
            name="routineName"
            value={workoutPlan.routineName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={workoutPlan.duration}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Difficulty"
            name="difficulty"
            value={workoutPlan.difficulty}
            onChange={handleChange}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Description:</Typography>
            {workoutPlan.description.map((desc, index) => (
              <Paper key={index} sx={{ p: 1, my: 1 }}>
                {desc}
              </Paper>
            ))}
            <IconButton onClick={addDescription} color="primary">
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
    </Box>
  );
};

export default NewWorkoutPlan;
