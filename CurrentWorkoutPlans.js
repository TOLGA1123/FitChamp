import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper, Modal, Fade, Backdrop, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import { green } from '@mui/material/colors';
import axios from 'axios';

axios.defaults.withCredentials = true;

const CurrentWorkoutPlans = () => {
  const history = useHistory();
  const [workoutDetails, setWorkoutDetails] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null); // For the selected workout
  const [open, setOpen] = useState(false); // For modal visibility

  useEffect(() => {
    axios.get('http://localhost:8000/workout-plans/')
      .then(response => {
        console.log('Response data:', response.data); // Log the response data
        setWorkoutDetails(response.data); // Expect an array of workout plans
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workout info:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  }, [history]);

  useEffect(() => {
    console.log('Workout details updated:', workoutDetails);
  }, [workoutDetails]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state while fetching user details
  }

  const handleRouteChange = (event, newValue) => {
    setSelectedTab(newValue);
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleNewWorkout = () => {
    history.push('/create-new-workout');
  };

  const handleGroupSession = () => {
    history.push('/group-session');
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleOpen = (workout) => {
    setSelectedWorkout(workout);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
        <Tabs 
          value={selectedTab}
          onChange={handleRouteChange} 
          sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, backgroundColor: 'black' }} 
          variant="fullWidth"
        >
          <Tab label="Workouts" value="workout-plans" sx={{ color: 'black', backgroundColor: green[500] }} />
          <Tab label="Trainers" value="trainers" sx={{ color: 'white', backgroundColor: 'black' }} />
          <Tab label="Nutrition Plans" value="nutrition" sx={{ color: 'white', backgroundColor: 'black' }} />
          <Tab label="Goals" value="goals" sx={{ color: 'white', backgroundColor: 'black' }} />
          <Tab label="Achievements" value="achievements" sx={{ color: 'white', backgroundColor: 'black' }} />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}><PersonIcon /></IconButton>
          <IconButton sx={{ position: 'absolute', left: 150 }} onClick={handleGroupSession}><GroupIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Current Workout Plans
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleNewWorkout}>
            <AddCircleOutlineIcon /><Typography variant="button">New Workout</Typography>
          </IconButton>        
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>

      {/* Map workout plans to display */}
      <Box sx={{ padding: 2 }}>
        {workoutDetails.length > 0 ? (
          workoutDetails.map((plan, index) => (
            <Paper key={index} elevation={3} sx={{ margin: 2, padding: 2, cursor: 'pointer' }} onClick={() => handleOpen(plan)}>
              <Typography variant="h6">{plan.Routine_Name}</Typography>
            </Paper>
          ))
        ) : (
          <div>No workout plans available</div>
        )}
      </Box>

      {/* Modal for displaying workout details */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6" component="h2">
              {selectedWorkout ? selectedWorkout.Routine_Name : ''}
            </Typography>
            {selectedWorkout && (
              <Box>
                <Typography variant="body1"><strong>Description:</strong> {selectedWorkout.Description}</Typography>
                <Typography variant="body1"><strong>Duration:</strong> {selectedWorkout.Duration}</Typography>
                <Typography variant="body1"><strong>Difficulty Level:</strong> {selectedWorkout.Difficulty_Level}</Typography>
              </Box>
            )}
            <Button onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default CurrentWorkoutPlans;
