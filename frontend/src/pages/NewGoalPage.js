import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, TextField, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { green } from '@mui/material/colors';
import axios from 'axios';
import moment from 'moment';

const SetGoals = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState('');
  const [goals, setGoals] = useState({
    goal_name: '',
    goal_type: 'Weight Loss',
    initial_value: '',
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

  const handleSubmit = () => {
    const startDate = moment().format('YYYY-MM-DD');
    const payload = {
      ...goals,
      start_date: startDate,
    };

    axios.post('http://localhost:8000/set-goals/', payload)
      .then(response => {
        console.log('Goals set:', response.data);
      })
      .catch(error => {
        console.error('Error setting goals:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: green[500] }}>
        <Tabs value={selectedTab} onChange={handleRouteChange} variant="fullWidth">
          <Tab label="Set Goals" value="set-goals" />
          <Tab label="Track Progress" value="track-progress" />
          <Tab label="Progress Reports" value="progress-reports" />
          <Tab label="Adjust Plan" value="adjust-plan" />
        </Tabs>
      </AppBar>
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
              <FormControlLabel value="Endurance Improvement" control={<Radio />} label="Endurance Improvement" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Initial Value"
            name="initial_value"
            value={goals.initial_value}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
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
