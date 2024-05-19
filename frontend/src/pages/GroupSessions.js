import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, IconButton, Grid, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import GroupIcon from '@mui/icons-material/Group';
import axios from 'axios';

const darkMintGreen = '#2E8B57'; // Define your dark mint green color
const darkAshGrey = '#4B4B4B'; // Define your dark ash grey color

const GroupSessions = () => {
  const history = useHistory();
  const [groupSessions, setGroupSessions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/group-sessions/')
      .then(response => {
        setGroupSessions(response.data);
      })
      .catch(error => {
        console.error('Error fetching GroupSessions:', error.response ? error.response.data : 'Server did not respond');
      });
  }, [history]);

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleProfileClick = () => {
    history.push('/trainer-profile');
  };

  const handleNewSessionClick = () => {
    // Add logic to create a new session
    history.push('/create-sessions');
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
            backgroundColor: darkAshGrey // Set the background color for the whole tabs container
          }}
          variant="fullWidth"
        >
          <Tab label="Trainees" value="trainees" sx={{ color: 'white' }} />
          <Tab label="Group Sessions" value="group-sessions" sx={{ color: 'black', backgroundColor: darkMintGreen }} />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px', position: 'relative' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon sx={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'white' }}>
            Your Groups Sessions
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleNewSessionClick}>
            <AddIcon sx={{ color: 'white' }} />
          </IconButton>
          <IconButton sx={{ position: 'absolute', right: 56 }} onClick={() => { /* Add logic for chat button */ }}>
            <ChatBubbleIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ p: 3, mx: 25, borderRadius: 2, textAlign: 'center' }}>
        <Grid container spacing={2} justifyContent="center">
          {groupSessions.map(session => (
            <Grid item xs={12} sm={6} key={session.group_session_id}>
              <Paper sx={{ p: 2 }}>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 64, height: 64 }}>
                        <GroupIcon sx={{ width: 48, height: 48 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={session.session_name} />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default GroupSessions;
