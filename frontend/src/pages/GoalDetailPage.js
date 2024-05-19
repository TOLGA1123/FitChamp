import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Typography, LinearProgress, Paper, Grid, Button  } from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import NavTabs from './NavTabs';

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

  const calculateProgress = (start, end) => {
    const startDate = moment(start);
    const endDate = moment(end);
    const today = moment();
    const totalDuration = endDate.diff(startDate, 'days');
    const daysPassed = today.diff(startDate, 'days');
    const progress = Math.min((daysPassed / totalDuration) * 100, 100);
    return Math.max(0, progress);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;
  if (!goalDetails) return <Typography>No goal details found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {goalDetails.name} - Progress
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Goal Type:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.type}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Goal ID:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.id}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Goal Type:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.type}</Paper>
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
          <Typography variant="h6">Trainer:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.trainer_name}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Completion:</Typography>
          <LinearProgress variant="determinate" value={calculateProgress(goalDetails.start_date, goalDetails.end_date)} />
          <Typography>{Math.round(calculateProgress(goalDetails.start_date, goalDetails.end_date))}%</Typography>
        </Grid>
        <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete Goal
        </Button>
      </Grid>
    </Box>
  );
};

export default GoalDetailPage;