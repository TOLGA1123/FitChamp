import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Typography, LinearProgress, Paper, Grid, Button } from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import NavTabs from './NavTabs';
import LogoutButton from './LogoutButton';

const GoalDetailPage = () => {
  const { goalId } = useParams();
  const [goalDetails, setGoalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // Fetch the goal details from the backend
    axios.get(`http://localhost:8000/goal/${goalId.trim()}/`, { withCredentials: true })
      .then(response => {
        setGoalDetails(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.response ? error.response.data : 'Server did not respond');
        setLoading(false);
      });
  }, [goalId]);

  const handleDelete = () => {
    axios.delete(`http://localhost:8000/goal/${goalId.trim()}/delete/`, { withCredentials: true })
      .then(response => {
        if (response.status === 204) {
          history.push('/goals');
        }
      })
      .catch(error => {
        console.error('Error deleting goal:', error.response ? error.response.data : 'Server did not respond');
      });
  };


  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;
  if (!goalDetails) return <Typography>No goal details found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <NavTabs activeTab="goals" />
      <Typography variant="h4" gutterBottom>
        {goalDetails.goal_name} - Progress
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Goal Name:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.goal_name}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Goal Type:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.goal_type}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Initial Value:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.initial_value}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Target Value:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.target_value}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Start Date:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.start_date}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">End Date:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.end_date}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Completion:</Typography>
          <LinearProgress variant="determinate" value={goalDetails.progress} />
          <Typography>{Math.round(goalDetails.progress)}%</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete Goal
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GoalDetailPage;
