/*import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper, Modal, Fade, Backdrop, Button, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { green } from '@mui/material/colors';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AllWorkoutsPage = () => {
  const history = useHistory();
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);  
  const [completedExercises, setCompletedExercises] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedWorkout(0);
    axios.get('http://localhost:8000/all-workouts/')
      .then(response => {
        setWorkoutDetails(response.data);
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

  const handleRouteChange = (event, newValue) => {
    setSelectedTab(newValue);
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

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleOpen = (workout) => {
    setSelectedWorkout(workout);
    setOpen(true);
  };

  const handleSubmitCompletedExercises = (workout) => {
    axios.get(`http://localhost:8000/select-workout/${workout.Routine_Name}/`)
    .then(response => {
      const completed = response.data.reduce((acc, exercise) => {
        acc[exercise.Exercise_name] = true;
        return acc;
      }, {});
      setCompletedExercises(completed);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching workout info:', error.response ? error.response.data : 'Server did not respond');
      setLoading(false);
      if (error.response && error.response.status === 401) {
        history.push('/login');
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
            Pick a Workout Plan
          </Typography>       
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>

      <Box sx={{ padding: 2 }}>
        {workoutDetails.length > 0 ? (
          workoutDetails.map((plan, index) => (
            <Paper key={index} elevation={3} sx={{ margin: 2, padding: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleOpen(plan)}>
                {plan.Routine_Name}
              </Typography>
            </Paper>
          ))
        ) : (
          <div>No workout plans available</div>
        )}
      </Box>

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
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h2">
              {selectedWorkout ? selectedWorkout.Routine_Name : ''}
            </Typography>
            {selectedWorkout && (
              <Box>
                <Typography variant="body1"><strong>Trainer:</strong> {selectedWorkout.Trainer_Name}</Typography>
                <Typography variant="body1"><strong>Duration:</strong> {selectedWorkout.Duration}</Typography>
                <Typography variant="body1"><strong>Difficulty Level:</strong> {selectedWorkout.Difficulty_Level}</Typography>
                <Typography variant="body1"><strong>Exercises:</strong></Typography>
                <Box>
                  {selectedWorkout.Exercises.map((exercise, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        label={exercise}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            <Button onClick={handleSubmitCompletedExercises(selectedWorkout)} sx={{ mt: 2 }}>Submit</Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default AllWorkoutsPage;*/

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper, Modal, Fade, Backdrop, Button, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import { green } from '@mui/material/colors';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AllWorkoutsPage = () => {
  const history = useHistory();
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);  
  const [completedExercises, setCompletedExercises] = useState({});
  const [open, setOpen] = useState(false);
  let startTime = -1;
  let endTime;

  let date = new Date();

  useEffect(() => {
    setSelectedWorkout(0);
    axios.get('http://localhost:8000/all-workouts/')
      .then(response => {
        setWorkoutDetails(response.data);
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

  const handleRouteChange = (event, newValue) => {
    setSelectedTab(newValue);
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

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleOpen = (workout) => {
    setSelectedWorkout(workout);
    axios.post(`http://localhost:8000/select-workout/${workout.Routine_Name}/`)
    .then(response => {
      const completed = response.data.reduce((acc, exercise) => {
        acc[exercise.Exercise_name] = true;
        return acc;
      }, {});
      setCompletedExercises(completed);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching workout info:', error.response ? error.response.data : 'Server did not respond');
      setLoading(false);
      if (error.response && error.response.status === 401) {
        history.push('/login');
      }
    });
    setOpen(true);
  };

  const handleSubmitCompletedExercises = () => {
    // Implement the function to handle submitting the completed exercises
  };

  const handleStartWorkout = (workout) => {
    startTime = date.getMinutes();
    console.log(startTime)
    setSelectedWorkout(workout);
    axios.post(`http://localhost:8000/add-start-time/${startTime}/${workout.Routine_Name}/`)
    .then()
    .catch(error => {
      console.error('Error fetching workout info:', error.response ? error.response.data : 'Server did not respond');
      if (error.response && error.response.status === 401) {
        history.push('/login');
      }
    });
  };

  const handleEndWorkout = (workout) => {
    endTime = date.getMinutes()
    setSelectedWorkout(workout);
    axios.post(`http://localhost:8000/add-end-time/${endTime}/${workout.Routine_Name}/`)
    .then()
    .catch(error => {
      console.error('Error fetching workout info:', error.response ? error.response.data : 'Server did not respond');
      if (error.response && error.response.status === 401) {
        history.push('/login');
      }
    });

  }

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
            Pick a Workout Plan
          </Typography>       
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>

      <Box sx={{ padding: 2 }}>
        {workoutDetails.length > 0 ? (
          workoutDetails.map((plan, index) => (
            <Paper key={index} elevation={3} sx={{ margin: 2, padding: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleOpen(plan)}>
                {plan.Routine_Name}
              </Typography>
            </Paper>
          ))
        ) : (
          <div>No workout plans available</div>
        )}
      </Box>

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
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h2">
              {selectedWorkout ? selectedWorkout.Routine_Name : ''}
            </Typography>
            {selectedWorkout && (
              <Box>
                <Typography variant="body1"><strong>Trainer:</strong> {selectedWorkout.Trainer_Name}</Typography>
                <Typography variant="body1"><strong>Duration:</strong> {selectedWorkout.Duration}</Typography>
                <Typography variant="body1"><strong>Difficulty Level:</strong> {selectedWorkout.Difficulty_Level}</Typography>
                <Typography variant="body1"><strong>Exercises:</strong></Typography>
                <Box>
                  {selectedWorkout.Exercises.map((exercise, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        label={exercise}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            <Button onClick={() => handleSubmitCompletedExercises} sx={{ mt: 2 }}>Submit</Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default AllWorkoutsPage;

