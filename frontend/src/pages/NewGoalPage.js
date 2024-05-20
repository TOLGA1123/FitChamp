import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography,IconButton, TextField, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { green } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import axios from 'axios';
import moment from 'moment';
import NavTabs from './NavTabs';
import LogoutButton from './LogoutButton';

const SetGoals = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState('');
  const [goals, setGoals] = useState({
    goal_name: '',
    goal_type: 'Weight Loss',
    target_value: '',
    end_date: ''
  });

  const handleRouteChange = (event, newValue) => {
    setSelectedTab(newValue);
    history.push(`/${newValue}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals({ ...goals, [name]: value });
  };
  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleSubmit = () => {
    const startDate = moment().format('YYYY-MM-DD');
    const payload = {
      ...goals,
      start_date: startDate,
    };

    axios.post('http://localhost:8000/new-goal/', payload)
      .then(response => {
        console.log('Goals set:', response.data);
        history.push('/goals')
      })
      .catch(error => {
        console.error('Error setting goals:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ flexGrow:1 }}>
      <AppBar position="static">
        <NavTabs activeTab="goals" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Create New Goal
          </Typography>

          <LogoutButton/>
        </Box>
        </AppBar>
    </Box>
      <Box sx={{ padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6">Set Your Fitness Goals</Typography>
          <TextField
            label="Goal Name"
            name="goal_name"
            value={goals.goal_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Goal Type</FormLabel>
            <RadioGroup
              name="goal_type"
              value={goals.goal_type}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="Weight Loss" control={<Radio />} label="Weight Loss" />
              <FormControlLabel value="Muscle Gain" control={<Radio />} label="Muscle Gain" />
              <FormControlLabel value= "Nutritional" control={<Radio />} label="Nutritional" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Target Value"
            name="target_value"
            value={goals.target_value}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            name="end_date"
            value={goals.end_date}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Set Goals
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default SetGoals;
