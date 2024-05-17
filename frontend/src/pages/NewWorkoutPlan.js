import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, TextField, Typography, Button, Grid, Paper, IconButton, Autocomplete, 
  Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, 
  Radio, Slider, AppBar, Tabs, Tab 
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { green } from '@mui/material/colors';
import { useHistory } from 'react-router-dom';

const NewWorkoutPlan = () => {
  const [workoutPlan, setWorkoutPlan] = useState({
    routineName: '',
    duration: '',
    description: [],
    trainee: null,
    trainer: null,
    difficulty: 0
  });

  const history = useHistory();
  const [exercises, setExercises] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newExercise, setNewExercise] = useState({
    Exercise_name: '',
    type: '',
    Description: '',
    Muscle_Group_Targeted: '',
    Equipment: '',
    Difficulty_Level: 1
  });

  const [selectedTab, setSelectedTab] = useState('workout-plans');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/exercises/')
      .then(response => {
        setExercises(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching goals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/workout-plans');
        }
      });
  }, [history]);

  if (loading) {
    return <div>Loading...</div>;
  }

  /*if (!exercises.length || !trainers.length || !trainees.length) {
    return <div>Error loading data</div>;
  }*/

  const handleChange = (event) => {
    const { name, value } = event.target;
    setWorkoutPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value
    }));
  };

  const handleRouteChange = (event, newValue) => {
    setSelectedTab(newValue);
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const addDescription = () => {
    if (selectedExercise) {
      const newDescription = [...workoutPlan.description, selectedExercise];
      const newDifficulty = newDescription.reduce((acc, exercise) => acc + exercise.difficulty, 0) / newDescription.length;

      setWorkoutPlan((prevPlan) => ({
        ...prevPlan,
        description: newDescription,
        difficulty: newDifficulty
      }));
      setSelectedExercise(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/create-workout-plan/', workoutPlan, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Workout plan created:', response.data);
      history.push('/workout-plans');
    } catch (error) {
      console.error('Error creating workout plan:', error);
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleNewExerciseChange = (event) => {
    const { name, value } = event.target;
    setNewExercise((prevExercise) => ({
      ...prevExercise,
      [name]: value
    }));
  };

  const handleSliderChange = (event, newValue) => {
    setNewExercise((prevExercise) => ({
      ...prevExercise,
      difficulty: newValue
    }));
  };

  const createNewExercise = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8000/create-exercise/', newExercise)
      .then(response => {
        console.log('Exercise Creation:', response);
        if (response.status === 200) {
          setExercises((prevExercises) => [...prevExercises, newExercise]);
          handleDialogClose(); // Redirect to login page after successful registration
        }
      })
      .catch(error => {
        console.error('Error creating exercise:', error);
      });

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
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Current Workout Plans
          </Typography>
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Routine Name"
              name="routineName"
              value={workoutPlan.routineName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Duration"
              name="duration"
              value={workoutPlan.duration}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Description:</Typography>
              {workoutPlan.description.map((desc, index) => (
                <Paper key={index} sx={{ p: 1, my: 1 }}>
                  {desc.Exercise_name}
                </Paper>
              ))}
              <Autocomplete
                options={exercises}
                getOptionLabel={(option) => option.Exercise_name}
                value={selectedExercise}
                onChange={(event, newValue) => {
                  setSelectedExercise(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Add Exercise" />}
                sx={{ mt: 2 }}
              />
              <IconButton onClick={addDescription} color="primary">
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
            <Autocomplete
              options={trainees}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setWorkoutPlan((prevPlan) => ({
                  ...prevPlan,
                  trainee: newValue ? newValue.name : null
                }));
              }}
              renderInput={(params) => <TextField {...params} label="Select Trainee" />}
              sx={{ mt: 2 }}
            />
            <Autocomplete
              options={trainers}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setWorkoutPlan((prevPlan) => ({
                  ...prevPlan,
                  trainer: newValue ? newValue.name : null
                }));
              }}
              renderInput={(params) => <TextField {...params} label="Select Trainer" />}
              sx={{ mt: 2 }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Difficulty: {workoutPlan.difficulty.toFixed(2)}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleDialogOpen} sx={{ mt: 2, ml: 2 }}>
              Create New Exercise
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Create New Exercise</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newExercise.name}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          />
          <RadioGroup
            name="type"
            value={newExercise.type}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="Cardio" control={<Radio />} label="Cardio" />
            <FormControlLabel value="Hypertrophy" control={<Radio />} label="Hypertrophy" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newExercise.description}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Muscle Group"
            name="muscleGroup"
            value={newExercise.muscleGroup}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Equipment"
            name="equipment"
            value={newExercise.equipment}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          />
          <Typography gutterBottom>Difficulty</Typography>
          <Slider
            value={newExercise.difficulty}
            onChange={handleSliderChange}
            step={1}
            marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={createNewExercise} color="primary" variant="contained">
            Submit
          </Button>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewWorkoutPlan;
