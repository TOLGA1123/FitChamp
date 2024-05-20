

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, IconButton, TextField, Grid, Button, Autocomplete } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const darkMintGreen = '#2E8B57'; // Define your dark mint green color
const darkAshGrey = '#4B4B4B'; // Define your dark ash grey color

const CreateGroupSession = () => {
  const history = useHistory();
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [maxParticipants, setMaxParticipants] = useState(5); // Initialize to 5
  const [formState, setFormState] = useState({
    name: '',
    location: '',
    startingTime: '',
    endTime: '',
    type: '',
  });

  useEffect(() => {
    axios.get('http://localhost:8000/trainer-trainees/')
      .then(response => {
        setTrainees(response.data);
      })
      .catch(error => {
        console.error('Error fetching trainees:', error.response ? error.response.data : 'Server did not respond');
      });
  }, []);

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/trainer-profile');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (selectedTrainees.length > maxParticipants) {
      alert('The number of selected trainees exceeds the maximum allowed participants.');
      return;
    }

    const data = {
      name: formState.name,
      location: formState.location,
      startingTime: formState.startingTime,
      endTime: formState.endTime,
      type: formState.type,
      maxParticipants: maxParticipants,
      trainee_ids: selectedTrainees.map(trainee => trainee.user_id),
    };

    axios.post('http://localhost:8000/create-session/', data)
      .then(response => {
        console.log('Form submitted', response.data);
        history.push('/group-sessions');
      })
      .catch(error => {
        console.error('Error submitting form:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ backgroundColor: darkMintGreen }}>
        <Tabs
          onChange={handleRouteChange}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexGrow: 1,
            backgroundColor: darkAshGrey
          }}
          variant="fullWidth"
        >
          <Tab label="Trainees" value="trainees" sx={{ color: 'white', backgroundColor: darkAshGrey }} />
          <Tab label="Group Sessions" value="group-sessions" sx={{ color: 'black', backgroundColor: darkMintGreen }} />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px', position: 'relative' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon sx={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'white' }}>
            Create Group Session
          </Typography>
          <LogoutButton/>
        </Box>
      </Box>
      <Box sx={{ p: 3, mx: 25, borderRadius: 2, textAlign: 'center' }}>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Session Name"
                name="name"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                value={formState.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                value={formState.location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Starting Time"
                name="startingTime"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                value={formState.startingTime}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Time"
                name="endTime"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                value={formState.endTime}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                value={formState.type}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Participants"
                name="maxParticipants"
                type="number"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10))}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={trainees}
                getOptionLabel={(option) => option.user_name}
                value={selectedTrainees}
                onChange={(event, newValue) => setSelectedTrainees(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="Select Trainees"
                    placeholder="Trainees"
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, backgroundColor: darkMintGreen }}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateGroupSession;

