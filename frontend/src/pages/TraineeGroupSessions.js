import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import axios from 'axios';

import { useHistory } from 'react-router-dom';
import {  Avatar, AppBar, Tabs, Tab, IconButton} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutButton from './LogoutButton';
import NavTabs from './NavTabs';

const TraineeGroupSessions = () => {
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  useEffect(() => {
    fetchGroupSessions();
  }, []);

  const fetchGroupSessions = () => {
    axios.get('http://localhost:8000/trainee-group-sessions/', { withCredentials: true })
      .then(response => {
        setJoinedSessions(response.data.joined_sessions);
        setAvailableSessions(response.data.available_sessions);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching group sessions:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
      });
  };
  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleJoinSession = (sessionId) => {
    axios.post(`http://localhost:8000/join-group-session/${sessionId}/`, {}, { withCredentials: true })
      .then(response => {
        fetchGroupSessions();
      })
      .catch(error => {
        console.error('Error joining group session:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <NavTabs activeTab="workout-plans" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}><PersonIcon /></IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Trainee Group Sessions
          </Typography>
          <LogoutButton/>
        </Box>
      </AppBar>
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 3 }}>
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Joined Group Sessions</Typography>
        <Grid container spacing={2}>
          {joinedSessions.length ? (
            joinedSessions.map(session => (
              <Grid item xs={12} key={session.group_session_id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{session.session_name}</Typography>
                  <Typography>Location: {session.location}</Typography>
                  <Typography>Start Time: {session.starting_time}</Typography>
                  <Typography>End Time: {session.end_time}</Typography>
                  <Typography>Type: {session.session_type}</Typography>
                  <Typography>Max Participants: {session.max_participants}</Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography>No joined sessions found.</Typography>
          )}
        </Grid>
      </Box>

      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Available Group Sessions</Typography>
        <Grid container spacing={2}>
          {availableSessions.length ? (
            availableSessions.map(session => (
              <Grid item xs={12} key={session.group_session_id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{session.session_name}</Typography>
                  <Typography>Location: {session.location}</Typography>
                  <Typography>Start Time: {session.starting_time}</Typography>
                  <Typography>End Time: {session.end_time}</Typography>
                  <Typography>Type: {session.session_type}</Typography>
                  <Typography>Max Participants: {session.max_participants}</Typography>
                  <Button variant="contained" onClick={() => handleJoinSession(session.group_session_id)}>Join Session</Button>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography>No available sessions found.</Typography>
          )}
        </Grid>
      </Box>
    </Box>
    </Box>
  );
};

export default TraineeGroupSessions;
