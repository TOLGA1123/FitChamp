import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, IconButton, TextField, Grid, Button, Autocomplete } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const darkMintGreen = '#2E8B57'; // Define your dark mint green color
const darkAshGrey = '#4B4B4B'; // Define your dark ash grey color

const CreateGroupSession = () => {
  const history = useHistory();
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [maxParticipants, setMaxParticipants] = useState(0);

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

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      location: formData.get('location'),
      startingTime: formData.get('startingTime'),
      endTime: formData.get('endTime'),
      type: formData.get('type'),
      maxParticipants: maxParticipants,
      price: formData.get('price'),
      trainee_ids: selectedTrainees.map(trainee => trainee.id),
    };

    if (selectedTrainees.length > maxParticipants) {
      alert('The number of selected trainees exceeds the maximum allowed participants.');
      return;
    }

    axios.post('http://localhost:8000/create-session/', data)
      .then(response => {
        console.log('Form submitted', response.data);
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
        </Box>
      </Box>
      <Box sx={{ p: 3, mx: 25, borderRadius: 2, textAlign: 'center' }}>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Starting Time"
                name="startingTime"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Time"
                name="endTime"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Participants"
                name="maxParticipants"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                variant="filled"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
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