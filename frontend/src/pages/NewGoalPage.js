import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Avatar, AppBar, Tabs, Tab } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { green } from '@mui/material/colors';

const NewGoalPage = () => {
  const history = useHistory();
  const [goal, setGoal] = useState({
    name: '',
    type: '',
    value: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal((prevGoal) => ({ ...prevGoal, [name]: value }));
  };

  const handleSubmit = () => {
    // Handle goal submission logic here, such as sending data to an API
    console.log('Goal Submitted:', goal);
    history.push('/goals'); // Redirect to goals page after submission
  };

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
        <Tabs
          onChange={handleRouteChange}
          sx={{ backgroundColor: 'black' }}
          variant="fullWidth"
        >
          <Tab label="Workouts" value="workouts" sx={{ color: 'white' }} />
          <Tab label="Trainers" value="trainers" sx={{ color: 'black', backgroundColor: green[500] }} />
          <Tab label="Nutrition Plans" value="nutrition-plans" sx={{ color: 'white' }} />
          <Tab label="Goals" value="goals" sx={{ color: 'white' }} />
          <Tab label="Progress" value="progress" sx={{ color: 'white' }} />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <Button onClick={handleProfileClick}>
            <Avatar />
          </Button>
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Set New Goal
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Goal Name"
              name="name"
              value={goal.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Goal Type"
              name="type"
              value={goal.type}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Goal Value"
              name="value"
              value={goal.value}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={goal.startDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={goal.endDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default NewGoalPage;
