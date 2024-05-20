import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, AppBar, IconButton, Menu, MenuItem, LinearProgress, TextField, Select, FormControl, InputLabel, Button } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import SortIcon from '@mui/icons-material/Sort';
import NavTabs from './NavTabs';
axios.defaults.withCredentials = true;

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [sortCriteria, setSortCriteria] = useState('endDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (sortCriteria) {
      fetchSortedGoals(sortCriteria);
    }
  }, [sortCriteria]);

  useEffect(() => {
    const updateGoalsAndFetch = async () => {
      try {
        await axios.get('http://localhost:8000/auto-update-goals/');
        fetchSortedGoals(sortCriteria);
      } catch (error) {
        console.error('Error updating goals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      }
    };
    updateGoalsAndFetch();
  }, [sortCriteria, history]);

  const fetchGoals = () => {
    axios.get('http://localhost:8000/goals/')
      .then(response => {
        setGoals(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching goals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  };

  const fetchSortedGoals = (sort_by) => {
    axios.get('http://localhost:8000/sort-goals/', { params: { sort_by } })
      .then(response => {
        setGoals(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sorted goals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  };

  const handleSearch = () => {
    axios.get('http://localhost:8000/search-goals/', { params: { query: searchQuery } })
      .then(response => {
        setGoals(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error searching goals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  };

  const handleFilter = () => {
    axios.get('http://localhost:8000/filter-goals/', { params: { type: filterType, startDate: filterStartDate } })
      .then(response => {
        setGoals(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error filtering goals:', error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          history.push('/login');
        }
      });
  };

  const handleGoalClick = (goalId) => {
    history.push(`/goal/${goalId.trim()}`);
  };

  const handleRouteChange = (event, newValue) => {
    history.push(`/${newValue}`);
  };

  const handleCreateNewGoal = () => {
    history.push('/new-goal');
  };

  const handleMSGClick = () => {
    history.push('/messages');
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.getAttribute('value'));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <NavTabs activeTab="goals" />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
            <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
              <PersonIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Your Goals
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleCreateNewGoal}>
              <AddCircleOutlineIcon />
              <Typography variant="button">New Goal</Typography>
            </IconButton>
            <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
              <MessageIcon />
            </IconButton>
          </Box>
        </AppBar>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <NavTabs activeTab="goals" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
          <IconButton sx={{ position: 'absolute', left: 16 }} onClick={handleProfileClick}>
            <PersonIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Your Goals
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" onClick={handleCreateNewGoal}>
            <AddCircleOutlineIcon />
            <Typography variant="button">New Goal</Typography>
          </IconButton>
          <IconButton sx={{ position: 'absolute', right: 16 }} onClick={handleMSGClick}>
            <MessageIcon />
          </IconButton>
          <IconButton sx={{ position: 'absolute', right: 80 }} color="inherit" onClick={handleMenuOpen}>
            <SortIcon />
          </IconButton>
        </Box>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem value="startDate" onClick={handleSortChange}>Start Date</MenuItem>
        <MenuItem value="endDate" onClick={handleSortChange}>End Date</MenuItem>
        <MenuItem value="GoalName" onClick={handleSortChange}>Goal Name</MenuItem>
        <MenuItem value="progress" onClick={handleSortChange}>Progress</MenuItem>
      </Menu>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField 
          label="Search" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          variant="outlined"
        />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Type"
          >
            <MenuItem value="Weight Loss">Weight Loss</MenuItem>
            <MenuItem value="Muscle Gain">Muscle Gain</MenuItem>
            <MenuItem value="Endurance Improvement">Endurance Improvement</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button variant="contained" onClick={handleFilter}>Filter</Button>
      </Box>

      <Grid container spacing={2}>
        {goals.length ? (
          goals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={goal.goal_id}>
              <Paper sx={{ p: 2, height: '100%', margin: '8px' }} onClick={() => handleGoalClick(goal.goal_id)}>
                <Typography variant="h6">Goal Name: {goal.goal_name}</Typography>
                <Typography>Goal Type: {goal.goal_type}</Typography>
                <Typography>Current Value: {goal.current_value}</Typography>
                <Typography>Target Value: {goal.target_value}</Typography>
                <Typography>Start Date: {goal.start_date}</Typography>
                <Typography>End Date: {goal.end_date}</Typography>
                <Typography>Status: {goal.achieved ? 'Achieved' : 'Not Achieved'}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography>Progress</Typography>
                  <LinearProgress variant="determinate" value={goal.progress} />
                  <Typography>{goal.progress}%</Typography>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography>No goals found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default GoalsPage;
