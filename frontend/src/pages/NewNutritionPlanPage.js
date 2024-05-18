import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Avatar, AppBar, Tabs, Tab, Autocomplete } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import { green } from '@mui/material/colors';
import axios from 'axios';
import NavTabs from './NavTabs';

const NewNutritionPlanPage = () => {
    const history = useHistory();
    const { trainee_Id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    total_calories: 0.0,
    meal_schedule: '',
    trainee_id: '',
  });

    const [trainees, setTrainees] = useState([]);
    
    

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    axios.get('http://localhost:8000/trainer-trainees/')
      .then(response => {
        setTrainees(response.data);
      })
      .catch(error => {
        console.error('Error fetching trainers:', error.response ? error.response.data : 'Server did not respond');
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`http://localhost:8000/new-nutrition-plan/${trainee_Id}/`, formData, {withCredentials: true})
      .then(response => {
        console.log('Nutrition Plan Submitted:', response.data);
        if (response.status === 201) {
          history.push('/nutrition');
        }
      })
      .catch(error => {
        console.error('New Nutrition Plan error:', error.response ? error.response.data : 'Server did not respond');
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
          Set New Nutrition Plan
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nutrition Plan Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nutrition Plan Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Total Calories"
              name="total_calories"
              value={formData.total_calories}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meal Schedule"
              name="meal_schedule"
              value={formData.meal_schedule}
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

export default NewNutritionPlanPage;
