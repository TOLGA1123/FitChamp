// pages/UserProfile.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Avatar, List, ListItem, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutButton from './LogoutButton';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { useEffect, useState } from 'react';
axios.defaults.withCredentials = true;

const TraineeViewPage = () => {
    const { trainee_Id } = useParams();
    const history = useHistory();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Fetch user details from the backend
        axios.get(`http://localhost:8000/trainee/${trainee_Id.trim()}/`, { withCredentials: true })
        .then(response => {
          setUserDetails(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user details:', error.response ? error.response.data : 'Server did not respond');
          setLoading(false);
          // Handle unauthorized access, e.g., redirect to login
          if (error.response && error.response.status === 401) {
            history.push('/');
          }
        });
    }, [trainee_Id]);

    const handleRouteChange = (event, newValue) => {
        history.push(`/${newValue}`);
    };
    
    const handleNewNutritionPlan = () => {
        history.push('/');
    };

  if (loading) {
    return <div>Loading...</div>; // Display a loading state while fetching user details
  }

  if (!userDetails) {
    return <div>Error loading user details</div>; // Display an error message if user details couldn't be fetched
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
       <Tabs
          onChange={handleRouteChange}
          sx={{ backgroundColor: 'black' }}
          variant="fullWidth"
        >
          <Tab label="Trainees" value="trainees" sx={{ color: 'black', backgroundColor: green[500] }} />
          <Tab label="Group Sessions" value="group-sessions" sx={{ color: 'white', backgroundColor: 'black' }} />
          <LogoutButton />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>


        <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          Your Trainee's Profile
        </Typography>
        <IconButton onClick={handleNewNutritionPlan} color="inherit">
            <AddCircleOutlineIcon />
            <Typography variant="button">New Nutrition Plan</Typography>
          </IconButton>
      </Box>
      </AppBar>

    <Box sx={{ flexGrow: 1, p: 3 }}>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Username
            </Typography>
            <Typography>{userDetails.trainee.user_name}</Typography>

            <Typography variant="h6" gutterBottom>
              Age
            </Typography>
            <Typography>{userDetails.trainee.age}</Typography>

            <Typography variant="h6" gutterBottom>
              Date of Birth:
            </Typography>
            <Typography>{userDetails.trainee.date_of_birth}</Typography>

            <Typography variant="h6" gutterBottom>
              Gender
            </Typography>
            <Typography>{userDetails.trainee.gender}</Typography>

            <Typography variant="h6" gutterBottom>
              Weight
            </Typography>
            <Typography>{userDetails.trainee.weight}</Typography>

            <Typography variant="h6" gutterBottom>
              Height
            </Typography>
            <Typography>{userDetails.trainee.height}</Typography>
            <Typography variant="h6" gutterBottom>
              Past Achievements
            </Typography>
            <Typography>{userDetails.trainee.past_achievements}</Typography>
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
                  <ListItem>
                    <ListItemText primary="Lose 10 lbs" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Run a marathon" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Progress
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Lost 5 lbs" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Half marathon completed" />
                  </ListItem>
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

export default TraineeViewPage;