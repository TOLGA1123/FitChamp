import React, { useState, useEffect } from 'react';
import { useHistory, useLocation  } from 'react-router-dom';
import { Typography, Box, AppBar, Tabs, Tab, Grid, Paper, Button } from '@mui/material';
import axios from 'axios';

const darkMintGreen = '#2E8B57'; // Define your dark mint green color
const darkAshGrey = '#4B4B4B'; // Define your dark ash grey color

const AdminPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [trainers, setTrainers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [reports, setReports] = useState([]);
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    // Fetch all trainers
    axios.get('http://localhost:8000/all-trainers/')
      .then(response => setTrainers(response.data))
      .catch(error => console.error('Error fetching trainers:', error.response ? error.response.data : 'Server did not respond'));

    // Fetch all trainees
    axios.get('http://localhost:8000/all-trainees/')
      .then(response => setTrainees(response.data))
      .catch(error => console.error('Error fetching trainees:', error.response ? error.response.data : 'Server did not respond'));

    // Fetch reports
    axios.get('http://localhost:8000/admin-reports/')
      .then(response => setReports(response.data))
      .catch(error => console.error('Error fetching reports:', error.response ? error.response.data : 'Server did not respond'));
  }, []);
  useEffect(() => {
    // Set tabIndex to 2 if the URL contains '/admin#reports'
    if (location.pathname === '/admin' && location.hash === '#reports') {
      setTabIndex(2);
    }
  }, [location]);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const handleCreateReport = () => {
    history.push('/new-report'); // Redirect to the page for creating a new report
  };
  console.log(reports);
  const renderTrainers = () => (
    <Grid container spacing={2}>
      {trainers.map(trainer => (
        <Grid item xs={12} sm={6} md={4} key={trainer.id}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{trainer.user_name}</Typography>
            <Typography variant="body2">Specialization: {trainer.specialization}</Typography>
            <Typography variant="body2">Telephone Number: {trainer.telephone_number}</Typography>
            <Typography variant="body2">Social Media: {trainer.social_media}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
  const renderTrainees = () => (
    <Grid container spacing={2}>
      {trainees.map(trainee => (
        <Grid item xs={12} sm={6} md={4} key={trainee.id}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{trainee.user_name}</Typography>
            <Typography variant="body1">User ID: {trainee.user_id}</Typography>
            <Typography variant="body2">Age: {trainee.age}</Typography>
            <Typography variant="body2">Date of Birth: {trainee.date_of_birth}</Typography>
            <Typography variant="body2">Gender: {trainee.gender}</Typography>
            <Typography variant="body2">Weight: {trainee.weight}</Typography>
            <Typography variant="body2">Height: {trainee.height}</Typography>
            <Typography variant="body2">Past Achievements: {trainee.past_achievements}</Typography>
            {/* Add more fields as needed */}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderReports = () => (
    <Box>
      <Typography variant="h6">Reports</Typography>
      <ul>
        {reports.map(report => (
          <li key={report.Report_ID}>
            <Typography variant="body1">Report ID: {report.Report_ID}</Typography>
            <Typography variant="body2">Report Type: {report.Report_Type}</Typography>
            <Typography variant="body2">Content: {report.Content}</Typography>
          </li>
        ))}
      </ul>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>
      <AppBar position="static" sx={{ backgroundColor: darkMintGreen }}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ backgroundColor: darkAshGrey }}>
          <Tab label="View All Trainers" />
          <Tab label="View All Trainees" />
          <Tab label="Reports" />
          {tabIndex === 2 && (
        <Box sx={{ ml: 'auto' }}>
          <Button variant="contained" color="primary" onClick={handleCreateReport}>Create New Report</Button>
        </Box>
      )}
        </Tabs>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {tabIndex === 0 && renderTrainers()}
        {tabIndex === 1 && renderTrainees()}
        {tabIndex === 2 && renderReports()}
      </Box>
    </Box>
  );
};

export default AdminPage;
