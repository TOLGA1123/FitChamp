import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import { green } from '@mui/material/colors';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import NavTabs from './NavTabs';
axios.defaults.withCredentials = true;

const NutritionPlanView = () => {
  const history = useHistory();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalories, setTotalCalories] = useState(0);
  const [selectedTab, setSelectedTab] = useState('nutrition');

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = () => {
    axios.get('http://localhost:8000/nutrition/')
      .then(response => {
        setMeals(response.data.meals);
        setTotalCalories(response.data.total_calories);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching meals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  };

  const handleRouteChange = (event, newValue) => {
    setSelectedTab(newValue);
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleNewTrainer = () => {
    history.push('/new-trainer');
  };

  const handleGroupSession = () => {
    history.push('/group-session');
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleAddMeal = () => {
    history.push('/addmeal');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ position: 'absolute', top: 100, right: 0, p: 2 }}>
        <LogoutButton />
      </Box>
      <AppBar position="static">
        <NavTabs activeTab="nutrition" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}><PersonIcon /></IconButton>
          <IconButton sx={{ position: 'absolute', left: 150 }} onClick={handleGroupSession}><GroupIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Nutrition Plans
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleAddMeal}>
            <AddCircleOutlineIcon />
            <Typography variant="button">Add Meal</Typography>
          </IconButton>
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Card sx={{ maxWidth: 500, margin: 'auto', textAlign: 'center', backgroundColor: '#e8f5e9', mb: 3 }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: green[700] }}>Total Calories</Typography>
            <Typography variant="h5" sx={{ color: green[900] }}>{totalCalories} kcal</Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>Logged Meals</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={3}>
            {meals.length ? (
              meals.map((meal) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={meal.meal_name}>
                  <Card sx={{ maxWidth: 345, margin: 'auto', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: green[700] }}>{meal.meal_name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Calories: {meal.calories}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Description: {meal.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No meals logged yet.</Typography>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default NutritionPlanView;
