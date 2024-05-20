import React, { useState } from 'react';
import { useHistory ,useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const ScheduleSessionPage = () => {
  const history = useHistory();
  const { user_id } = useParams();
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleScheduleSession = () => {
    // Send a POST request to the backend to schedule the session
    const sessionData = {
      session_date: sessionDate,
      session_time: sessionTime,
      location: location,
      description: description,
    };

    axios.post(`http://localhost:8000/schedule-session/${user_id}/`, sessionData)
      .then(response => {
        // Handle success, e.g., show a success message
        console.log('Session scheduled successfully:', response.data);
        // Redirect to a confirmation page or any other page
        history.push('/trainees');
      })
      .catch(error => {
        // Handle error, e.g., show an error message
        console.error('Error scheduling session:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  return (
    <Box>
      <Typography variant="h4">Schedule Session</Typography>
      <TextField
        label="Date"
        type="date"
        value={sessionDate}
        onChange={(e) => setSessionDate(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Time"
        type="time"
        value={sessionTime}
        onChange={(e) => setSessionTime(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleScheduleSession}>Schedule Session</Button>
    </Box>
  );
};

export default ScheduleSessionPage;