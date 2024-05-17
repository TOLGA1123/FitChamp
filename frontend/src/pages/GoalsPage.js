import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText,AppBar, Tabs, Tab, IconButton } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';
import MessageIcon from '@mui/icons-material/Message';
axios.defaults.withCredentials = true;

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:8000/goals/')
      .then(response => {
        setGoals(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching goals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  }, [history]);

  const handleGoalClick = (goalId) => {
    history.push(`/goal/${goalId.trim()}`);
  };

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleCreateNewGoal = () => {
    // Navigate to the goal creation page
    history.push('/new-goal');
  };
  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow:1 }}>
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
              sx={{ color: 'black', backgroundColor: green[500]  }}
            />

            <Tab label="Achievements" value="achievements" sx={{ color: 'white', backgroundColor: 'black' }} />
          </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Your Goals
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleCreateNewGoal}>
            <AddCircleOutlineIcon />
            <Typography variant="button">New Goal</Typography>
          </IconButton>
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>

      <Typography variant="h4" gutterBottom>
        Your Goals
      </Typography>
      <Grid container spacing={2}>
        {goals.length ? (
          goals.map((goal) => (
            <Grid item xs={12} key={goal.id}>
              <Paper sx={{ p: 2 }} onClick={() => handleGoalClick(goal.id)}>
                <Typography variant="h6">Goal Name: {goal.name}</Typography>
                <Typography>Goal Type: {goal.type}</Typography>
                <Typography>Value: {goal.value}</Typography>
                <Typography>Start Date: {goal.start_date}</Typography>
                <Typography>End Date: {goal.end_date}</Typography>
                <Typography>Status: {goal.status}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography>No goals found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default GoalsPage;
