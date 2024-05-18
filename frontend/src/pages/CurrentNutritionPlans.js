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
import NavTabs from './NavTabs';
axios.defaults.withCredentials = true;


const CurrentNutritionPlans = () => {
    const [nutrition_plans, setNutritionPlans] = useState([])
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
    axios.get('http://localhost:8000/nutrition/')
      .then(response => {
        setNutritionPlans(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching nutrition plans:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
    }, [history]);

    const handleRouteChange = (event, newValue) => {
        history.push(`/${newValue}`);
    };

    const handleMSGClick = () => {
        history.push('/messages');
    };

    const handleProfileClick = () => {
        history.push('/profile');
    };

    if (loading) {
        return( 
        <Box sx={{ flexGrow:1 }}>
            
        <AppBar position="static" >
            <NavTabs activeTab="nutrition" />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
            <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
                <PersonIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Your Nutrition Plans
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
                <MessageIcon />
            </IconButton>
            </Box>
        </AppBar>
        <Typography>Loading...</Typography>;
        </Box>
        )
    }

    return (
        <Box sx={{ flexGrow:1 }}>
            
        <AppBar position="static" >
            <NavTabs activeTab="nutrition" />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
            <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
                <PersonIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Your Nutrition Plans
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
                <MessageIcon />
            </IconButton>
            </Box>
        </AppBar>

        <Typography variant="h4" gutterBottom>
            Your Nutrition Plans
        </Typography>
        <Grid container spacing={2}>
            {nutrition_plans.length ? (
            nutrition_plans.map((nutrition_plan) => (
                <Grid item xs={12} key={nutrition_plan.name}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">Nutrition Plan Name: {nutrition_plan.name}</Typography>
                    <Typography>Nutrition Plan Description: {nutrition_plan.description}</Typography>
                    <Typography>Total Calories: {nutrition_plan.total_calories}</Typography>
                    <Typography>Meal Schedule: {nutrition_plan.meal_schedule}</Typography>
                </Paper>
                </Grid>
            ))
            ) : (
                <Typography>No nutrition plans found.</Typography>
            )}
        </Grid>
        </Box>
    );
}
export default CurrentNutritionPlans;