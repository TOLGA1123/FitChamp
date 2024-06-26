import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, IconButton, Paper, Modal, Fade, Backdrop, Button, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { green } from '@mui/material/colors';
import NavTabs from './NavTabs';

import LogoutButton from './LogoutButton';
import axios from 'axios';
axios.defaults.withCredentials = true;


const CurrentWorkoutPlans = () => {
  const history = useHistory();
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);  
  const [completedExercises, setCompletedExercises] = useState({});
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState({});
  let [startTime, setStartTime] = useState(-1);

  let endTime;

  let date = new Date();

  useEffect(() => {
    axios.get('http://localhost:8000/workout-plans/')
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

  useEffect(() => {
    axios.get('http://localhost:8000/completed-workouts/')
      .then(response => {
        setCompletedWorkouts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching completed workout info:', error.response ? error.response.data : 'Server did not respond');
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
    history.push('/all-workouts');
  };

  const handleGroupSession = () => {
    history.push('/group-session');
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleOpen = (workout) => {
    setSelectedWorkout(workout);
    axios.get(`http://localhost:8000/completed-exercises/${workout.Routine_Name.trim()}/`)
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (exercise) => {
    if (!completedExercises[exercise]) {
      setCompletedExercises(prev => ({ ...prev, [exercise]: !prev[exercise] }));
    }
  };

  const handleSubmitCompletedExercises = () => {
    const completed = Object.keys(completedExercises).filter(exercise => completedExercises[exercise]);
    const payload = {
      completedExercises: completed,
      routineName: selectedWorkout.Routine_Name,
      trainerId: selectedWorkout.Trainer_ID,
    };
    axios.post('http://localhost:8000/complete-exercises/', payload)
      .then(response => {
        handleClose();
      })
      .catch(error => {
        console.error('Error submitting completed exercises:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  const openConfirmDialogHandler = (type, data) => {
    setConfirmDialogData({ type, data });
    setOpenConfirmDialog(true);
  };

  const closeConfirmDialogHandler = () => {
    setOpenConfirmDialog(false);
    setConfirmDialogData({});
  };

  const confirmDeleteHandler = () => {
    if (confirmDialogData.type === 'workout') {
      handleDeleteWorkout(confirmDialogData.data.routineName, confirmDialogData.data.trainerId);
    } else if (confirmDialogData.type === 'exercise') {
      handleDeleteExercise(confirmDialogData.data.exercise);
    }
    closeConfirmDialogHandler();
  };

  const handleDeleteExercise = (exercise) => {
    axios.post('http://localhost:8000/delete-exercise/', {
      exerciseName: exercise,
      routineName: selectedWorkout.Routine_Name,
      trainerId: selectedWorkout.Trainer_ID,
    }, { withCredentials: true })
    .then(response => {
      setSelectedWorkout(prev => ({
        ...prev,
        Exercises: prev.Exercises.filter(e => e !== exercise),
      }));
      setCompletedExercises(prev => {
        const updated = { ...prev };
        delete updated[exercise];
        return updated;
      });
    })
    .catch(error => {
      console.error('Error deleting exercise:', error.response ? error.response.data : 'Server did not respond');
    });
  };

  const handleDeleteWorkout = (routineName, trainerId) => {
    axios.post('http://localhost:8000/delete-workout/', {
      routineName: routineName,
      trainerId: trainerId,
    }, { withCredentials: true })
    .then(response => {
      setWorkoutDetails(prev => prev.filter(plan => plan.Routine_Name !== routineName));
    })
    .catch(error => {
      console.error('Error deleting workout:', error.response ? error.response.data : 'Server did not respond');
    });
  };

  const   handleStartWorkout = (workout) => {
    const temp = date.getMinutes();
    startTime = setStartTime(temp);
    console.log(temp)
    let actualStartTime = date.getMinutes()
    setSelectedWorkout(workout);
    axios.post(`http://localhost:8000/add-start-time/${actualStartTime}/${workout.Routine_Name}/`)
    .then()
    .catch(error => {
      console.error('Error fetching workout info:', error.response ? error.response.data : 'Server did not respond');
      if (error.response && error.response.status === 401) {
        history.push('/login');
      }
    });
  };

  const handleEndWorkout = (workout) => {
    endTime = date.getMinutes();
    console.log(endTime);
    setSelectedWorkout(workout);
    axios.post(`http://localhost:8000/add-end-time/${endTime}/${workout.Routine_Name}/`)
    .then(() => {
      // Update the state to remove the ended workout
      setWorkoutDetails(prev => prev.filter(plan => plan.Routine_Name !== workout.Routine_Name));
      // Optionally, update the completed workouts list
      setCompletedWorkouts(prev => [...prev, workout]);
    })
    .catch(error => {
      console.error('Error fetching workout info:', error.response ? error.response.data : 'Server did not respond');
      if (error.response && error.response.status === 401) {
        history.push('/login');
      }
    });
  };

  if (loading) {
    return(<Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
      <NavTabs activeTab="workout-plans" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} ><PersonIcon /></IconButton>
          <IconButton sx={{ position: 'absolute', left: 150 }}><GroupIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Current Workout Plans
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleNewWorkout}>
            <AddCircleOutlineIcon /><Typography variant="button">Pick Workout</Typography>
          </IconButton>        
          <LogoutButton />
        </Box>
      </AppBar>
      <div>Loading...</div>
      </Box>) ;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
      <NavTabs activeTab="workout-plans" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}><PersonIcon /></IconButton>
          <IconButton sx={{ position: 'absolute', left: 150 }} onClick={handleGroupSession}><GroupIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Current Workout Plans
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleNewWorkout}>
            <AddCircleOutlineIcon /><Typography variant="button">Pick Workout</Typography>
          </IconButton>        
          <LogoutButton />
        </Box>
      </AppBar>

      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Current Workouts</Typography>
        {workoutDetails.length > 0 ? (
          workoutDetails.map((plan, index) => (
            <Paper key={index} elevation={3} sx={{ margin: 2, padding: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleOpen(plan)}>
                {plan.Routine_Name}
              </Typography>
              <IconButton onClick={() => openConfirmDialogHandler('workout', { routineName: plan.Routine_Name, trainerId: plan.Trainer_ID })}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        ) : (
          <div>No workout plans available</div>
        )}

        <Typography variant="h6" sx={{ marginTop: 4 }}>Completed Workouts</Typography>
        {completedWorkouts.length > 0 ? (
          completedWorkouts.map((workout, index) => (
            <Paper key={index} elevation={3} sx={{ margin: 2, padding: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {workout.Routine_Name}
              </Typography>
            </Paper>
          ))
        ) : (
          <div>No completed workouts available</div>
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
                      <Typography>{exercise}</Typography>
                    </Box>
                  ))}
                </Box>
                {startTime === -1 ? (
              <Button onClick={() => handleStartWorkout(selectedWorkout)} sx={{ mt: 2 }}>Start Workout</Button>
              ) : (
                <Button onClick={() => handleEndWorkout(selectedWorkout)} sx={{ mt: 2 }}>End Workout</Button>
              )}
              </Box>
            )}
            
          </Box>
        </Fade>
      </Modal>

      <Dialog
        open={openConfirmDialog}
        onClose={closeConfirmDialogHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this {confirmDialogData.type === 'workout' ? 'workout' : 'exercise'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialogHandler} color="primary">
            No
          </Button>
          <Button onClick={confirmDeleteHandler} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CurrentWorkoutPlans;

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
import LogoutButton from './LogoutButton';

axios.defaults.withCredentials = true;

const CurrentWorkoutPlans = () => {
  const history = useHistory();
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('workout-plans');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/workout-plans/')
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

  useEffect(() => {
    axios.get('http://localhost:8000/completed-workouts/')
      .then(response => {
        setCompletedWorkouts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching completed workout info:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  }, [history]);

  const handleRouteChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleNewWorkout = () => {
    history.push('/all-workouts');
  };

  const handleGroupSession = () => {
    history.push('/group-session');
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleOpen = (workout) => {
    setSelectedWorkout(workout);
    axios.get(`http://localhost:8000/completed-exercises/${workout.Routine_Name.trim()}/`)
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (exercise) => {
    if (!completedExercises[exercise]) {
      setCompletedExercises(prev => ({ ...prev, [exercise]: !prev[exercise] }));
    }
  };

  const handleSubmitCompletedExercises = () => {
    const completed = Object.keys(completedExercises).filter(exercise => completedExercises[exercise]);
    const payload = {
      completedExercises: completed,
      routineName: selectedWorkout.Routine_Name,
      trainerId: selectedWorkout.Trainer_ID,
    };
    axios.post('http://localhost:8000/complete-exercises/', payload)
      .then(response => {
        setCompletedWorkouts(prev => [...prev, selectedWorkout]);
        handleClose();
      })
      .catch(error => {
        console.error('Error submitting completed exercises:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  const openConfirmDialogHandler = (type, data) => {
    setConfirmDialogData({ type, data });
    setOpenConfirmDialog(true);
  };

  const closeConfirmDialogHandler = () => {
    setOpenConfirmDialog(false);
    setConfirmDialogData({});
  };

  const confirmDeleteHandler = () => {
    if (confirmDialogData.type === 'workout') {
      handleDeleteWorkout(confirmDialogData.data.routineName, confirmDialogData.data.trainerId);
    } else if (confirmDialogData.type === 'exercise') {
      handleDeleteExercise(confirmDialogData.data.exercise);
    }
    closeConfirmDialogHandler();
  };

  const handleDeleteExercise = (exercise) => {
    axios.post('http://localhost:8000/delete-exercise/', {
      exerciseName: exercise,
      routineName: selectedWorkout.Routine_Name,
      trainerId: selectedWorkout.Trainer_ID,
    }, { withCredentials: true })
    .then(response => {
      setSelectedWorkout(prev => ({
        ...prev,
        Exercises: prev.Exercises.filter(e => e !== exercise),
      }));
      setCompletedExercises(prev => {
        const updated = { ...prev };
        delete updated[exercise];
        return updated;
      });
    })
    .catch(error => {
      console.error('Error deleting exercise:', error.response ? error.response.data : 'Server did not respond');
    });
  };

  const handleDeleteWorkout = (routineName, trainerId) => {
    axios.post('http://localhost:8000/delete-workout/', {
      routineName: routineName,
      trainerId: trainerId,
    }, { withCredentials: true })
    .then(response => {
      setWorkoutDetails(prev => prev.filter(plan => plan.Routine_Name !== routineName));
    })
    .catch(error => {
      console.error('Error deleting workout:', error.response ? error.response.data : 'Server did not respond');
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ position: 'absolute', top: 100, right: 0, p: 2 }}>
        <LogoutButton />
      </Box>
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
            <AddCircleOutlineIcon /><Typography variant="button">Pick Workout</Typography>
          </IconButton>        
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>

      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Current Workouts</Typography>
        {workoutDetails.length > 0 ? (
          workoutDetails.map((plan, index) => (
            <Paper key={index} elevation={3} sx={{ margin: 2, padding: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleOpen(plan)}>
                {plan.Routine_Name}
              </Typography>
              <IconButton onClick={() => openConfirmDialogHandler('workout', { routineName: plan.Routine_Name, trainerId: plan.Trainer_ID })}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        ) : (
          <div>No workout plans available</div>
        )}

        <Typography variant="h6" sx={{ marginTop: 4 }}>Completed Workouts</Typography>
        {completedWorkouts.length > 0 ? (
          completedWorkouts.map((workout, index) => (
            <Paper key={index} elevation={3} sx={{ margin: 2, padding: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {workout.Routine_Name}
              </Typography>
            </Paper>
          ))
        ) : (
          <div>No completed workouts available</div>
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
                        control={
                          <Checkbox
                            checked={!!completedExercises[exercise]}
                            onChange={() => handleCheckboxChange(exercise)}
                            name={exercise}
                            disabled={completedExercises[exercise]}
                          />
                        }
                        label={exercise}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            <Button onClick={handleSubmitCompletedExercises} sx={{ mt: 2 }}>Submit</Button>
          </Box>
        </Fade>
      </Modal>

      <Dialog
        open={openConfirmDialog}
        onClose={closeConfirmDialogHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this {confirmDialogData.type === 'workout' ? 'workout' : 'exercise'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialogHandler} color="primary">
            No
          </Button>
          <Button onClick={confirmDeleteHandler} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CurrentWorkoutPlans;*/

