import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Box, Typography, IconButton, TextField, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import { green } from '@mui/material/colors';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import NavTabs from './NavTabs';
axios.defaults.withCredentials = true;

const NewMeal = () => {
  const history = useHistory();
  const [mealName, setMealName] = useState('');
  const [calorieCount, setCalorieCount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTab, setSelectedTab] = useState('nutrition');

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

  const handleLogMeal = () => {
    const mealData = {
      meal_name: mealName,
      calorie_count: calorieCount,
      description: description,
    };

    axios.post('http://localhost:8000/addmeal/', mealData)
      .then(response => {
        console.log('Meal logged successfully:', response.data);
        setMealName('');
        setCalorieCount('');
        setDescription('');
        history.push('/nutrition');
      })
      .catch(error => {
        console.error('Error logging meal:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ position: 'absolute', top: 100, right: 0, p: 2 }}>
        <LogoutButton />
      </Box>
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
        <NavTabs activeTab="nutrition" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}><PersonIcon /></IconButton>
          <IconButton sx={{ position: 'absolute', left: 150 }} onClick={handleGroupSession}><GroupIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Nutrition Plans
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleLogMeal}>
            <AddCircleOutlineIcon />
            <Typography variant="button">Add Meal</Typography>
          </IconButton>
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Add a New Meal</Typography>
        <TextField
          label="Meal Name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          sx={{ mb: 2, width: '100%' }}
        />
        <TextField
          label="Calorie Count"
          value={calorieCount}
          onChange={(e) => setCalorieCount(e.target.value)}
          sx={{ mb: 2, width: '100%' }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2, width: '100%' }}
          multiline
          rows={4}
        />
        <Button variant="contained" onClick={handleLogMeal}>Submit</Button>
      </Box>
    </Box>
  );
};

export default NewMeal;
