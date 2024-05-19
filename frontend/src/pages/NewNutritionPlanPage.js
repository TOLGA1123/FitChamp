import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button, Avatar, AppBar, Autocomplete } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import NavTabs from './NavTabs';

const NewNutritionPlanPage = () => {
  const history = useHistory();
  const { trainee_Id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    total_calories: 0.0,
    meal_schedule: '',
    trainee_id: trainee_Id,
    meals: [],
  });

  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/meals/')
      .then(response => {
        setMeals(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching meals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addMeal = () => {
    if (selectedMeal) {
      setFormData(prevState => ({
        ...prevState,
        meals: [...prevState.meals, selectedMeal]
      }));
      setSelectedMeal(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`http://localhost:8000/new-nutrition-plan/${trainee_Id}/`, formData, { withCredentials: true })
      .then(response => {
        console.log('Nutrition Plan Submitted:', response.data);
        if (response.status === 201) {
          history.push('/trainer-trainees/');
        }
      })
      .catch(error => {
        console.error('New Nutrition Plan error:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <NavTabs activeTab="nutrition-plans" />
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nutrition Plan Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Calories"
                name="total_calories"
                value={formData.total_calories}
                onChange={handleChange}
                required
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={meals}
                getOptionLabel={(option) => option.Meal_name}
                value={selectedMeal}
                onChange={(event, newValue) => {
                  setSelectedMeal(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Add Meal" />}
              />
              <Button variant="contained" color="primary" onClick={addMeal} sx={{ mt: 2 }}>
                Add Meal
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Selected Meals:</Typography>
              <ul>
                {formData.meals.map((meal, idx) => (
                  <li key={idx}>{meal.Meal_name}</li>
                ))}
              </ul>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default NewNutritionPlanPage;
