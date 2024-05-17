import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Avatar, AppBar, Tabs, Tab,Autocomplete } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { green } from '@mui/material/colors';
import axios from 'axios';

const NewGoalPage = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    value: 0.0,
    startDate: '',
    endDate: '',
    status: 'NEW',
    trainer_id: '',
  });

  const [trainers, setTrainers] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

const handleSubmit = (event) => {
  event.preventDefault();
  axios.post('http://localhost:8000/new-goal/', formData)
    .then(response => {
      console.log('Goal Submitted:', response.data);
      if (response.status === 201) {
        history.push('/goals');
      }
    })
    .catch(error => {
      console.error('New Goal error:', error.response ? error.response.data : 'Server did not respond');
    });
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
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Goal Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Goal Value"
              name="value"
              value={formData.value}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
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
              value={formData.endDate}
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