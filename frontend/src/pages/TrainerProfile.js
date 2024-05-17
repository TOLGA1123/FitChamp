import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Grid, Paper, Avatar, Button, AppBar, Tabs, Tab, Box, Typography, IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

import LogoutButton from './LogoutButton';
const TrainerProfile = () => {
  const { trainerId } = useParams();
  const [trainerDetails, setTrainerDetails] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };
  const handleMSGClick = () => {
    history.push('/messages');
  };
  const handleBackClick = () => {
    history.push('/trainers');
  };

  useEffect(() => {
      // Fetch user details from the backend
      axios.get('http://localhost:8000/profile/')
        .then(response => {
          setTrainerDetails(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user details:', error.response ? error.response.data : 'Server did not respond');
          setLoading(false);
          // Handle unauthorized access, e.g., redirect to login
          if (error.response && error.response.status === 401) {
            history.push('/login');
          }
        });
    }, [history]);



  if (loading) {
    return <div>Loading...</div>; // Display a loading state while fetching user details
  }
  
  if (!trainerDetails) return <Typography>Error loading data...</Typography>;

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
            sx={{ color: 'black', backgroundColor: green[500]  }}
          />
          <Tab 
            label="Nutrition Plans" 
            value="nutrition" 
            sx={{ color: 'white', backgroundColor: 'black' }}
          />
          <Tab 
            label="Goals" 
            value="goals" 
            sx={{ color: 'white', backgroundColor: 'black' }}
          />

          <Tab label="Achievements" value="achievements" sx={{ color: 'white', backgroundColor: 'black' }} />
        </Tabs>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
        <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
         <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }} gutterBottom>Trainer {trainerDetails.id} Profile </Typography>
        <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
          <MessageIcon />
        </IconButton>
        <LogoutButton />
      </Box>
    </AppBar>
    <Box sx={{ flexGrow: 1, p: 3 }}>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Avatar sx={{ width: 120, height: 120, margin: 'auto' }} />
          <List>
            <ListItem>
              <ListItemText primary="Username" secondary={trainerDetails.username} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Specialization" secondary={trainerDetails.trainer.specialization} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Phone Number" secondary={trainerDetails.trainer.telephone_number} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Social Media" secondary={trainerDetails.trainer.social_media} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper elevation={3} sx={{ p: 2, marginBottom: 2 }}>
            <Typography variant="h6">Assigned Workout</Typography>
            <Typography>{trainerDetails.assignedWorkout}</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Assigned Nutrition Plan</Typography>
            <Typography>{trainerDetails.nutritionPlan}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    </Box>
  );
};
async function fetchTrainerDetails(trainerId) {
    // Replace with actual API call
    return {
        id: trainerId,
        name: "Trainer Name",
        username: "TrainerUsername",
        email: "email@example.com",
        specialization: "Weight Training",
        contactInfo: {
            phone: "123-456-7890",
            socialMedia: "@trainerSocial"
        },
        assignedWorkout: "Advanced Cardio",
        nutritionPlan: "Keto Diet"
    };
}


export default TrainerProfile;
