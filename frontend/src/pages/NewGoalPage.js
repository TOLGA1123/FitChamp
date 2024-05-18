import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Avatar, AppBar, Tabs, Tab,Autocomplete } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { green } from '@mui/material/colors';
import axios from 'axios';
import NavTabs from './NavTabs';

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

  useEffect(() => {
    axios.get('http://localhost:8000/trainers/')
      .then(response => {
        setTrainers(response.data);
      })
      .catch(error => {
        console.error('Error fetching trainers:', error.response ? error.response.data : 'Server did not respond');
      });
  }, []);

  
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
      <AppBar position="static">
      <NavTabs activeTab="goals" />
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
        <Autocomplete
              options={trainers}
              getOptionLabel={(option) => option.user_name}
              onChange={(event, newValue) => {
                console.log('Selected Trainer:', newValue);
                setFormData((prevPlan) => ({
                  ...prevPlan,
                  trainer_id: newValue ? newValue.trainer_id : null
                }));
              }}
              renderInput={(params) => <TextField {...params} label="Select Trainer" />}
              sx={{ mt: 2 }}
            />
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