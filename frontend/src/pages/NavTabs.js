// NavTabs.js
import React from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';
import { useHistory } from 'react-router-dom';

const darkMintGreen = '#2E8B57'; // Define your dark mint green color
const darkAshGrey = '#4B4B4B'; // Define your dark ash grey color

const NavTabs = ({ activeTab }) => {
  const history = useHistory();

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: darkMintGreen }}>
      <Tabs 
        value={activeTab}
        onChange={handleRouteChange} 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexGrow: 1, 
          backgroundColor: 'darkAshGrey',
          '& .MuiTab-root': {
            color: 'white', // Default color for all tabs
            backgroundColor: darkAshGrey, // Default background for all tabs
          },
          '& .Mui-selected': {
            color: 'black', // Color for selected tab
            backgroundColor: darkMintGreen, // Background for selected tab
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'transparent', // Hide the default indicator
          },
        }} 
        variant="fullWidth"
      > 
        <Tab 
          label="Workouts" 
          value="workout-plans" 
        />
        <Tab 
          label="Trainers" 
          value="trainers" 
        />
        <Tab 
          label="Nutrition Plans" 
          value="nutrition" 
        />
        <Tab 
          label="Goals" 
          value="goals" 
        />
        <Tab 
          label="Achievements" 
          value="achievements" 
        />
      </Tabs>
    </AppBar>
  );
};

export default NavTabs;