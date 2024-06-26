import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, TextField, Typography, Button, Grid, Paper, IconButton, Autocomplete, 
  Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, 
  Radio, Slider, AppBar, Tabs, Tab, 
  FormControl
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { green } from '@mui/material/colors';
import { useHistory } from 'react-router-dom';
import NavTabs from './NavTabs';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import LogoutButton from './LogoutButton';

const NewWorkoutPlan = () => {
  const [workoutPlan, setWorkoutPlan] = useState({
    Routine_Name: '',
    Duration: '',
    trainer_id: '',
    user_id:  '',
    Difficulty_Level: 0,
    exerc: [],
  });

  const history = useHistory();
  const [exercises, setExercises] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { trainee_id } = useParams();

  const [newExercise, setNewExercise] = useState({
    Exercise_name: '',
    Target_Audiance: '',
    Description: '',
    Calories_Burned: '',
    Equipment: '',
    Difficulty_Level: 1,
  });

  const [selectedTab, setSelectedTab] = useState('workout-plans');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/trainers/')
      .then(response => {
        setTrainers(response.data);
      })
      .catch(error => {
        console.error('Error fetching trainers:', error.response ? error.response.data : 'Server did not respond');
      });
  }, []);
  

  useEffect(() => {
    axios.get('http://localhost:8000/exercises/')
      .then(response => {
        setExercises(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching exercises:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/workout-plans');
        }
      });
  }, [history]);

  if (loading) {
    return (<Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <NavTabs activeTab="workout-plans" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} ><PersonIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Create Workout Plan
          </Typography>
          <LogoutButton/>
        </Box>
      </AppBar>
      <div>Loading...</div>
      </Box>);
  }

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

  const addExercise = () => {
    if (selectedExercise) {
      const newExerc = [...workoutPlan.exerc, selectedExercise];
      let sum = 0;
      for (let i = 0; i < newExerc.length; i++) {
        console.log(newExerc[i].Difficulty_Level)
        sum += parseInt(newExerc[i].Difficulty_Level, 10);
      }
      
      const newDifficulty = sum / newExerc.length;
      setWorkoutPlan((prevPlan) => ({
        ...prevPlan,
        exerc: newExerc,
        Difficulty_Level: newDifficulty
      }));
      setSelectedExercise(null);
    }
  };

  const createNewExercise = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8000/create-exercise/', newExercise)
      .then(response => {
        console.log('Exercise Creation:', response);
        if (response.status === 200) {
          setExercises((prevExercises) => [...prevExercises, newExercise]);
          handleDialogClose(); // Close dialog after successful creation
        }
      })
      .catch(error => {
        console.error('Error creating exercise:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`http://localhost:8000/create-workout-plan/`, workoutPlan)
      .then(response => {
        console.log('Workout Plan Submitted:', response.data);
        if (response.status === 201) {
          history.push('/trainees');
        }
      })
      .catch(error => {
        console.error('New Workout Plan error:', error.response ? error.response.data : 'Server did not respond');
      });
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
      Difficulty_Level: newValue
    }));
  };

  const handleExerciseTypeChange = (event) => {
    const { value } = event.target;
    let min = 1, max = 10;

    if (value === 'Beginner') {
      min = 1;
      max = 3;
    } else if (value === 'Intermediate') {
      min = 4;
      max = 7;
    } else if (value === 'Advanced') {
      min = 8;
      max = 10;
    }

    setNewExercise((prevExercise) => ({
      ...prevExercise,
      type: value,
      Difficulty_Level: min,
    }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <NavTabs activeTab="workout-plans" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}><PersonIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Create Workout Plan
          </Typography>
          <LogoutButton/>
        </Box>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Routine Name"
              name="Routine_Name"
              value={workoutPlan.Routine_Name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Duration"
              name="Duration"
              value={workoutPlan.Duration}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Description:</Typography>
              
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
              <IconButton onClick={addExercise} color="primary">
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Difficulty: {workoutPlan.Difficulty_Level.toFixed(2)}
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
            name="Exercise_name"
            value={newExercise.Exercise_name}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          />
          <FormControl>
          <RadioGroup
            name="type"
            value={newExercise.type}
            
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="Beginner" onChange={handleExerciseTypeChange} control={<Radio />} label="Beginner" />
            <FormControlLabel value="Intermediate" onChange={handleExerciseTypeChange} control={<Radio />} label="Intermediate" />
            <FormControlLabel value="Advanced" onChange={handleExerciseTypeChange} control={<Radio />} label="Advanced" />
          </RadioGroup>
          </FormControl>
          <TextField
            fullWidth
            label="Description"
            name="Description"
            value={newExercise.Description}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Muscle Group"
            name="Muscle_Group_Targeted"
            value={newExercise.Muscle_Group_Targeted}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Equipment"
            name="Equipment"
            value={newExercise.Equipment}
            onChange={handleNewExerciseChange}
            sx={{ mb: 2 }}
          />
          <Typography gutterBottom>Difficulty</Typography>
          <Slider
            value={newExercise.Difficulty_Level}
            onChange={handleSliderChange}
            step={1}
            marks
            min={newExercise.type === 'Beginner' ? 1 : newExercise.type === 'Intermediate' ? 4 : 8}
            max={newExercise.type === 'Beginner' ? 3 : newExercise.type === 'Intermediate' ? 7 : 10}
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

