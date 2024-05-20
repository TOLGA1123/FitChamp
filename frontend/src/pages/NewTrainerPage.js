import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Avatar, Typography, Button, AppBar, IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import axios from 'axios';
import NavTabs from './NavTabs';
import LogoutButton from './LogoutButton';
axios.defaults.withCredentials = true;

const NewTrainerPage = () => {
  const history = useHistory();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    // Fetch trainers from the backend
    axios.get('http://localhost:8000/new-trainer/')
      .then(response => {
        setTrainers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching trainers:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        // Handle unauthorized access, e.g., redirect to login
        if (error.response && error.response.status === 401) {
          // history.push('/login');
        }
      });
  }, [history]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state while fetching trainers
  }

  if (!trainers) {
    return <div>Error loading trainers</div>; // Display an error message if trainers couldn't be fetched
  }

  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer);
  };

  const handleConfirmTrainer = () => {
    if (selectedTrainer) {
      axios.post('http://localhost:8000/new-trainer/', { trainer_id: selectedTrainer.trainer_id })
        .then(response => {
          console.log('Trainer added successfully:', response.data);
          history.push('/trainers'); // Redirect to trainers page or another relevant page
        })
        .catch(error => {
          console.error('Error adding trainer:', error.response ? error.response.data : 'Server did not respond');
        });
      history.push('/trainers'); // Redirect to trainers page or another relevant page
    }
  };

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

  return (
    <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '100vh' }}>
      <AppBar position="static" >
        <NavTabs activeTab="trainers" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            New Trainer
          </Typography>
          <LogoutButton/>
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {trainers.map((trainer) => (
            <Grid item xs={12} sm={6} md={4} key={trainer.trainer_id} onClick={() => handleSelectTrainer(trainer)}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center', cursor: 'pointer', border: selectedTrainer?.id === trainer.id ? '2px solid blue' : 'none' }}>
              <Avatar src={`data:image/jpeg;base64,${trainer.profile_picture}`} sx={{ width: 56, height: 56, margin: 'auto' }} />
                <Typography>Username: {trainer.user_name}</Typography>
                <Typography>Specialization: {trainer.specialization}</Typography>
                <Typography>Social Media: {trainer.social_media}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, backgroundColor: 'white', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmTrainer}
          sx={{ width: '100%' }}
          disabled={!selectedTrainer}
        >
          Confirm Trainer
        </Button>
      </Box>
    </Box>
  );
};

export default NewTrainerPage;
