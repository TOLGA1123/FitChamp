import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const ScheduleSessionPage = () => {
  const history = useHistory();
  const { user_id } = useParams();
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScheduleSession = () => {
    const sessionData = {
      session_date: sessionDate,
      session_time: sessionTime,
      location: location,
      description: description,
    };

    axios.post(`http://localhost:8000/schedule-session/${user_id}/`, sessionData, { withCredentials: true })
      .then(response => {
        console.log('Session scheduled successfully:', response.data);
        history.push('/trainees');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('Failed to schedule session. Please try again later.');
        }
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Schedule Session</Typography>
      {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
      <TextField
        label="Date"
        type="date"
        value={sessionDate}
        onChange={(e) => setSessionDate(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
      <TextField
        label="Time"
        type="time"
        value={sessionTime}
        onChange={(e) => setSessionTime(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
      <TextField
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
      <Button variant="contained" onClick={handleScheduleSession}>Schedule Session</Button>
    </Box>
  );
};

export default ScheduleSessionPage;
