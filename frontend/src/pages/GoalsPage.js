import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, AppBar, Paper, IconButton, Menu, MenuItem, LinearProgress, TextField, Select, FormControl, InputLabel, Button, Card, CardContent, CardActionArea } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import SortIcon from '@mui/icons-material/Sort';
import NavTabs from './NavTabs';
import { green } from '@mui/material/colors';
import LogoutButton from './LogoutButton';

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
    if (searchQuery.trim() === '') {
      fetchGoals(); // Call the function to fetch all goals
    } else {
      axios.get('http://localhost:8000/search-goals/', { params: { q: searchQuery } })
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
    }
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
            <IconButton sx={{ position: 'absolute', left: 16 }} >
              <PersonIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Your Goals
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 150 }} color="inherit" >
              <AddCircleOutlineIcon />
              <Typography variant="button">New Goal</Typography>
            </IconButton>
            <LogoutButton/>
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
        <LogoutButton/>
        <IconButton sx={{ position: 'absolute', right: 80 }} color="inherit" onClick={handleMenuOpen}>
          <SortIcon />
        </IconButton>
      </Box>
    </AppBar>

    <Paper elevation={3} sx={{ padding: 2, margin: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField 
          label="Search" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Type"
          >
            <MenuItem value="Weight Loss">Weight Loss</MenuItem>
            <MenuItem value="Muscle Gain">Muscle Gain</MenuItem>
            <MenuItem value="Nutritional">Nutritional</MenuItem>
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

        <Button variant="contained" color="primary" onClick={handleFilter}>Filter</Button>

        <Typography variant="body1">Sort By:</Typography>
        <IconButton color="primary" onClick={handleMenuOpen}>
          <SortIcon />
        </IconButton>
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
      </Box>
    </Paper>

    <Grid container spacing={3}>
      {goals.length ? (
        goals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={goal.goal_id}>
            <Card sx={{ maxWidth: 345, margin: 'auto', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
              <CardActionArea onClick={() => handleGoalClick(goal.goal_id)}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: green[700] }}>{goal.goal_name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Goal Type: {goal.goal_type}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Current Value: {goal.current_value}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Target Value: {goal.target_value}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Start Date: {goal.start_date}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>End Date: {goal.end_date}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Status: {goal.achieved ? 'Achieved' : 'Not Achieved'}</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography>Progress</Typography>
                    <LinearProgress variant="determinate" value={goal.progress} />
                    <Typography>{goal.progress}%</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
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
