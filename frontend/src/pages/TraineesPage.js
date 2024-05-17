import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Avatar, AppBar, Tabs, Tab, IconButton, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import { green } from '@mui/material/colors';

const TraineesPage = () => {
  const history = useHistory();
  const trainees = [
    { id: 1, name: 'Client 1' },
    { id: 2, name: 'Client 2' }
    // Add more trainees as needed
  ];

  const handleTraineeSelect = (traineeId) => {
    history.push(`/trainee-profile/${traineeId}`);
  };

  const handleNewClient = () => {
    history.push('/add-client');
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
          {trainees.map((trainee) => (
            <Grid item xs={12} sm={6} md={4} key={trainee.id} onClick={() => handleTraineeSelect(trainee.id)}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, margin: 'auto' }} />
                <Typography>{trainee.name}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TraineesPage;
