import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Avatar, AppBar, Tabs, Tab, IconButton, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';
axios.defaults.withCredentials = true;

const TraineesPage = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [Trainees, setTrainees] = useState(null);
  useEffect(() => {
    // Fetch user details from the backend
    axios.get('http://localhost:8000/trainer-trainees/')
      .then(response => {
        setTrainees(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user details:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        // Handle unauthorized access, e.g., redirect to login
        if (error.response && error.response.status === 401) {
          //history.push('/login');
        }
      });
  }, [history]);
  if (loading) {
    return <div>Loading...</div>; // Display a loading state while fetching user details
  }

  if (!Trainees) {
    return <div>Error loading user details</div>; // Display an error message if user details couldn't be fetched
  }

  const handleTraineeSelect = (traineeId) => {
    history.push(`/trainee/${traineeId}`);
  };

  const handleNewClient = () => {
    history.push('/new-trainee');
  };

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleProfileClick = (trainerId) => {
    history.push(`/trainer-profile/${trainerId}`);
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Your Trainees
          </Typography>
          <IconButton onClick={handleNewClient} color="inherit">
            <AddCircleOutlineIcon />
            <Typography variant="button">New Client</Typography>
          </IconButton>
          <IconButton onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {Trainees.map((trainee) => (
            <Grid item xs={12} sm={6} md={4} key={trainee.id} onClick={() => handleTraineeSelect(trainee.user_id)}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, margin: 'auto' }} />
                <Typography>{trainee.user_name}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TraineesPage;
