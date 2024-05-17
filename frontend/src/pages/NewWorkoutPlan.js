import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Grid, Paper, IconButton, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, Slider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const darkMintGreen = '#2E8B57'; // Define your dark mint green color
const darkAshGrey = '#4B4B4B'; // Define your dark ash grey color
const lila = '#cc99ff';
const mavi = '#009999';

const NewWorkoutPlan = () => {
  const history = useHistory();
  const [workoutPlan, setWorkoutPlan] = useState({
    routineName: '',
    duration: '',
    description: [],
    trainee: null,
    trainer: null,
    difficulty: 0
  });

  const [exercises, setExercises] = useState([
    { name: 'Bah', type: 'Cardio', description: 'Bah', muscleGroup: 'Legs', equipment: 'None', difficulty: 1 },
    { name: 'Rah', type: 'Cardio', description: 'Rah', muscleGroup: 'Arms', equipment: 'Dumbbells', difficulty: 2 }
  ]);
  
  const [trainees, setTrainees] = useState([
    { name: 'John Doe' },
    { name: 'Jane Smith' }
  ]);
  
  const [trainers, setTrainers] = useState([
    { name: 'Mike Johnson' },
    { name: 'Sarah Connor' }
  ]);

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: 'Cardio',
    description: '',
    muscleGroup: '',
    equipment: '',
    difficulty: 1
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setWorkoutPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value
    }));
  };

  const handleRouteChange = (event, newValue) => {
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
      setSelectedExercise(null); // Clear the selected exercise
    }
  };

  const handleSubmit = () => {
    console.log('Submitting New Workout Plan:', workoutPlan);
    // Implement submit logic, possibly making a POST request to your backend
    history.push('/workout-plans'); // Redirect to the workout plans overview
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

  const createNewExercise = () => {
    console.log('Creating New Exercise:', newExercise);
    // Implement the exercise creation logic, possibly making a POST request to your backend
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    handleDialogClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: darkMintGreen }}>
        <Tabs
          onChange={handleRouteChange}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexGrow: 1,
            backgroundColor: darkAshGrey // Set the background color for the whole tabs container
          }}
          variant="fullWidth"
        >
          <Tab
            label="Workouts"
            value="workout-plans"
            sx={{
              color: 'black',
              backgroundColor: darkMintGreen
            }}
          />
          <Tab
            label="Trainers"
            value="trainers"
            sx={{ color: 'white', backgroundColor: darkAshGrey }}
          />
          <Tab
            label="Nutrition Plans"
            value="nutrition"
            sx={{ color: 'white', backgroundColor: darkAshGrey }}
          />
          <Tab
            label="Goals"
            value="goals"
            sx={{ color: 'white', backgroundColor: darkAshGrey }}
          />
          <Tab label="Achievements" value="achievements" sx={{ color: 'white', backgroundColor: darkAshGrey }} />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>

          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Create a Workout Plan
          </Typography>
        </Box>
      </AppBar>
      <Box sx={{ p: 3, mx: 25, backgroundColor: mavi, borderRadius: 2 }}> {/* Added background color and border radius to the Box */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Routine Name"
              name="routineName"
              value={workoutPlan.routineName}
              onChange={handleChange}
              sx={{ backgroundColor: 'white', borderRadius: 1 }} // To make sure the text fields stand out
            />
            <TextField
              fullWidth
              label="Duration"
              name="duration"
              value={workoutPlan.duration}
              onChange={handleChange}
              sx={{ mt: 2, backgroundColor: 'white', borderRadius: 1 }} // To make sure the text fields stand out
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" color="white">Description:</Typography> {/* Changed color to white */}
              {workoutPlan.description.map((desc, index) => (
                <Paper key={index} sx={{ p: 1, my: 1 }}>
                  {desc.name}
                </Paper>
              ))}
              <Autocomplete
                options={exercises}
                getOptionLabel={(option) => option.name}
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
            <Typography variant="h6" color="white" sx={{ mt: 2 }}>
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
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            background: repeating-linear-gradient(
              45deg,
              ${lila},
              ${lila} 40px,
              ${darkAshGrey} 40px,
              ${darkAshGrey} 50px
            );
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
        `}
      </style>
    </Box>
  );
};

export default NewWorkoutPlan;
