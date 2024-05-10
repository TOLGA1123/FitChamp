import React from 'react';
import { Grid, Paper, Avatar, Button, AppBar, Tabs, Tab, Box, Typography, IconButton } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { green } from '@mui/material/colors';

const GoalsPage = () => {
  const history = useHistory();
  const goals = [
    { id: 1, title: 'Goal 1', description: 'Description of Goal 1' },
    { id: 2, title: 'Goal 2', description: 'Description of Goal 2' },
    // You can add more goals here or fetch them from a backend server
  ];
  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleCreateNewGoal = () => {
    // Navigate to the goal creation page
    history.push('/create-goal');
  };
  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleProfileClick = () => {
    history.push('/profile');
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
      <Box sx={{ m: 3 }}>
        <Grid container spacing={2}>
          {goals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal.id} onClick={() => history.push(`/goal-detail/${goal.id}`)}>
              <Paper elevation={2} sx={{ height: 140, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography>{goal.title}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default GoalsPage;