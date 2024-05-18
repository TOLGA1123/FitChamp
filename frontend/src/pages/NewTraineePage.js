import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Avatar, Typography, Button, AppBar, Tabs, Tab, IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import { green } from '@mui/material/colors';
import axios from 'axios';
axios.defaults.withCredentials = true;

const NewTraineePage = () => {
  const history = useHistory();
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    // Fetch user details from the backend
    axios.get('http://localhost:8000/new-trainee/')
      .then(response => {
        setTrainees(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user details:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        // Handle unauthorized access, e.g., redirect to login
        if (error.response && error.response.status === 401) {
          // history.push('/login');
        }
      });
  }, [history]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state while fetching user details
  }

  if (!trainees) {
    return <div>Error loading user details</div>; // Display an error message if user details couldn't be fetched
  }
console.log(trainees);
  const handleSelectTrainee = (trainee) => {
    setSelectedTrainee(trainee);
  };

  const handleConfirmTrainee = () => {
    if (selectedTrainee) {
      axios.post('http://localhost:8000/new-trainee/', { user_id: selectedTrainee.user_id })
        .then(response => {
          console.log('Trainee added successfully:', response.data);
          history.push('/trainees'); // Redirect to trainees page or another relevant page
        })
        .catch(error => {
          console.error('Error adding trainee:', error.response ? error.response.data : 'Server did not respond');
        });
        history.push('/trainees'); // Redirect to trainers page or another relevant page
    }
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
    <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '100vh' }}>
      <AppBar position="static" >
        <Tabs
          onChange={handleRouteChange}
          sx={{ backgroundColor: 'black' }}
          variant="fullWidth"
        >
          <Tab label="Trainees" value="trainees" sx={{ color: 'black', backgroundColor: green[500] }} />
          <Tab label="Group Sessions" value="groupsessions" sx={{ color: 'white' }} />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            New Trainee
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
        {trainees.map((trainee) => (
            <Grid item xs={12} sm={6} md={4} key={trainee.user_id} onClick={() => handleSelectTrainee(trainee)}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center', cursor: 'pointer', border: selectedTrainee?.id === trainee.id ? '2px solid blue' : 'none' }}>
                <Avatar sx={{ width: 56, height: 56, margin: 'auto' }} />
                <Typography>Username: {trainee.user_name}</Typography>
                <Typography>Age: {trainee.age}</Typography>
                <Typography>Date of Birth: {trainee.date_of_birth}</Typography>
                <Typography>Gender: {trainee.gender}</Typography>
                <Typography>Weight: {trainee.weight}</Typography>
                <Typography>Height: {trainee.height}</Typography>
                <Typography>Past Achievements: {trainee.past_achievements}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, backgroundColor: 'white', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmTrainee}
          sx={{ width: '100%' }}
          disabled={!selectedTrainee}
        >
          Confirm Trainee
        </Button>
      </Box>
    </Box>
  );
};

export default NewTraineePage;
