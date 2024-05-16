// pages/UserProfile.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Avatar, List, ListItem, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserProfile = () => {
  const history = useHistory();
  const [profileData, setProfileData] = useState({
      user: {},
      goals: [],
      progress: [],
      trainers: [],
      workout_plans: [],
      nutrition_plans: [],
      achievements: []
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.user_id;
        axios.get(`http://localhost:8000/api/profile/${userId}`)
        .then(response => {
            setProfileData(response.data);
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    } else {
        console.error('No userId found in localStorage');
    }
}, []);

  if (!profileData) {
    return <div>Loading...</div>;  // Handle loading state
  }
  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleNewWorkout = () => {
    history.push('/new-workout');
  };

  const handleGroupSession = () => {
    history.push('/group-session');
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
            sx={{ color: 'white', backgroundColor: 'black' }}
          />
          <Tab 
            label="Progress" 
            value="progress" 
            sx={{ color: 'white', backgroundColor: 'black' }}
          />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>


        <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          Your Profile
        </Typography>
      </Box>
      </AppBar>

    <Box sx={{ flexGrow: 1, p: 3 }}>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Username
            </Typography>
            <Typography>{profileData.user.user_name}</Typography>

            <Typography variant="h6" gutterBottom>
              Mail
            </Typography>
            <Typography>{profileData.user.email}</Typography>

            <Typography variant="h6" gutterBottom>
              Age
            </Typography>
            <Typography>{profileData.user.age}</Typography>

            <Typography variant="h6" gutterBottom>
              Date of Birth:
            </Typography>
            <Typography>{profileData.user.date_of_birth}</Typography>

            <Typography variant="h6" gutterBottom>
              Gender
            </Typography>
            <Typography>{profileData.user.gender}</Typography>

            <Typography variant="h6" gutterBottom>
              Weight
            </Typography>
            <Typography>{profileData.user.weight}</Typography>

            <Typography variant="h6" gutterBottom>
              Height
            </Typography>
            <Typography>{profileData.user.height}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Goals
                </Typography>
                <List>
                  {profileData.goals.map((goal, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={goal} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Progress
                </Typography>
                <List>
                                        {profileData.progress.map((progressItem, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={progressItem} />
                                            </ListItem>
                                        ))}
                                    </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    </Box>
  );
};

export default UserProfile;