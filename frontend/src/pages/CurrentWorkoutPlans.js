import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { green } from '@mui/material/colors';
import MessageIcon from '@mui/icons-material/Message';

// Define a class for workout plans
axios.defaults.withCredentials = true;

class WorkoutPlan {
  constructor(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
  }
}

axios.defaults.withCredentials = true;

    
  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };
  if (loading) {
    return <div>Loading...</div>; // Display a loading state while fetching user details
  }

  if (!userDetails) {
    return <div>Error loading user details</div>; // Display an error message if user details couldn't be fetched
  }


const CurrentWorkoutPlans = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState('');

  useEffect(() => {
    // Fetch user details from the backend
    axios.get('http://localhost:8000/workout-plans/')
      .then(response => {
        setWorkoutDetails(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workout info:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        // Handle unauthorized access, e.g., redirect to login
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  }, [history]);
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
      {workoutPlans.map((plan) => (
        <Paper key={plan.id} elevation={3} sx={{ margin: 2, padding: 2 }}>
          <Typography variant="h6">{plan.title}</Typography>
          <Typography>{plan.description}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default CurrentWorkoutPlans;
