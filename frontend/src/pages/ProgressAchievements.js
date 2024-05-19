import React, { useState, useEffect } from 'react';
import { Grid, Paper, Avatar, Button, AppBar, Tabs, Tab, Box, Typography, IconButton } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { green } from '@mui/material/colors';
import LogoutButton from './LogoutButton';
import NavTabs from './NavTabs';
const ProgressAchievements = () => {
  const history = useHistory();
  const [achievements, setAchievements] = useState([]);
  useEffect(() => {
    // Simulate fetching data for achievements and goals
    const fetchAchievements = async () => {
      const data = await getAchievements();
      setAchievements(data);  // Set achievements directly
    };
    fetchAchievements();
  }, []);
  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  // Combine the achievements and goals while maintaining their order

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
      <NavTabs activeTab="achievements" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          Your Achievements
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
        </Box>
      </AppBar>
      <Box sx={{ m: 3 }}>
        <Grid container spacing={2}>
          {achievements.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={2} sx={{ height: 140, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                <Typography>{item.title}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
    
  );
};

async function getAchievements() {
  // Replace this with actual API call
  return [
    { title: 'Achievement 1' },
    { title: 'Achievement 2' },
    { title: 'Achievement 3' },
  ];
}

export default ProgressAchievements;