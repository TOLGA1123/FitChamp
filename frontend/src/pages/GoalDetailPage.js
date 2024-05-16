import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, LinearProgress, Paper, Grid } from '@mui/material';
import moment from 'moment';

const GoalDetailPage = () => {
  const { goalId } = useParams();
  const [goalDetails, setGoalDetails] = useState(null);

  useEffect(() => {
    // Fetch the goal details from an API
    fetchGoalDetails(goalId).then(details => {
      setGoalDetails(details);
    });
  }, [goalId]);

  const calculateProgress = (start, end) => {
    const startDate = moment(start);
    const endDate = moment(end);
    const today = moment();
    const totalDuration = endDate.diff(startDate, 'days');
    const daysPassed = today.diff(startDate, 'days');
    const progress = Math.min((daysPassed / totalDuration) * 100, 100);
    return Math.max(0, progress);
  };

  if (!goalDetails) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {goalDetails.name} - Progress
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Progress Name:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.name}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Progress Type:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.type}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Start Date:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.startDate}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">End Date:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.endDate}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Details:</Typography>
          <Paper sx={{ p: 2 }}>{goalDetails.details}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Completion:</Typography>
          <LinearProgress variant="determinate" value={calculateProgress(goalDetails.startDate, goalDetails.endDate)} />
          <Typography>{Math.round(calculateProgress(goalDetails.startDate, goalDetails.endDate))}%</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

async function fetchGoalDetails(goalId) {
  // Replace this with actual API call
  return {
    id: goalId,
    name: "Progress 1",
    type: "Fitness",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    details: "Complete 12 fitness milestones",
  };
}

export default GoalDetailPage;
