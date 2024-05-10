// pages/UserProfile.js
import React from 'react';
import { Box, Grid, Paper, Typography, Avatar, List, ListItem, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';

const UserProfile = () => {
    const history = useHistory();

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

          <Tab label="Achievements" value="achievements" sx={{ color: 'white', backgroundColor: 'black' }} />
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
            <Typography>JohnDoe123</Typography>

            <Typography variant="h6" gutterBottom>
              Mail
            </Typography>
            <Typography>johndoe@example.com</Typography>

            <Typography variant="h6" gutterBottom>
              Age
            </Typography>
            <Typography>25</Typography>

            <Typography variant="h6" gutterBottom>
              Date of Birth:
            </Typography>
            <Typography>1995-05-16</Typography>

            <Typography variant="h6" gutterBottom>
              Phone Number:
            </Typography>
            <Typography>+1234567890</Typography>

            <Typography variant="h6" gutterBottom>
              Gender
            </Typography>
            <Typography>Male</Typography>

            <Typography variant="h6" gutterBottom>
              Weight
            </Typography>
            <Typography>180 lbs</Typography>

            <Typography variant="h6" gutterBottom>
              Height
            </Typography>
            <Typography>6'0"</Typography>
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

export default UserProfile;