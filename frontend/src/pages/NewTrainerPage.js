import React, { useState } from 'react';
import { Box, Grid, Paper, Avatar, Typography, Button, AppBar, Tabs, Tab, IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { useEffect} from 'react';
import NavTabs from './NavTabs';
axios.defaults.withCredentials = true;

const NewTrainerPage = () => {
  const history = useHistory();
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [Trainers, setTrainers] = useState(null);
  useEffect(() => {
    // Fetch user details from the backend
    axios.get('http://localhost:8000/new-trainer/')
      .then(response => {
        setTrainers(response.data);
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

  if (!Trainers) {
    return <div>Error loading user details</div>; // Display an error message if user details couldn't be fetched
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
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
      <NavTabs activeTab="trainers" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            New Trainer
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {Trainers.map((Trainer) => (
            <Grid item xs={12} sm={6} md={4} key={Trainer.trainer_id} onClick={() => handleSelectTrainer(Trainer)}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center', cursor: 'pointer', border: selectedTrainer?.id === Trainer.id ? '2px solid blue' : 'none' }}>
                <Avatar sx={{ width: 56, height: 56, margin: 'auto' }} />
                <Typography>Username: {Trainer.user_name}</Typography>
                <Typography>Specialization: {Trainer.specialization}</Typography>
                <Typography>Social Media: {Trainer.social_media}</Typography>
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
