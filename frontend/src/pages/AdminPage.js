import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography, Box, AppBar, Tabs, Tab, Grid, Card, CardContent, Button, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Avatar, Paper} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import NavTabs from './NavTabs';
const darkMintGreen = '#2E8B57';
const lightMintGreen = '#E0FFE0'; // Lighter mint green for reports
const darkAshGrey = '#4B4B4B';
const lightGrey = '#F5F5F5';
const primaryColor = '#1976d2';
const trainerCardBg = '#ADD8E6';
const traineeCardBg = '#ADD8E6'; // Light blue color
const tabHoverColor = '#3CB371'; // Hover color for tabs

const AdminPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [trainers, setTrainers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    axios.all([
      axios.get('http://localhost:8000/all-trainers/'),
      axios.get('http://localhost:8000/all-trainees/'),
      axios.get('http://localhost:8000/admin-reports/')
    ])
    .then(axios.spread((trainersRes, traineesRes, reportsRes) => {
      setTrainers(trainersRes.data);
      setTrainees(traineesRes.data);
      setReports(reportsRes.data);
      setLoading(false);
    }))
    .catch(error => {
      console.error('Error fetching data:', error.response ? error.response.data : 'Server did not respond');
      setLoading(false);
    });
  }, []);
  /*useEffect(() => {
    console.log(trainers); // Check the structure of trainers
    trainers.forEach(trainer => {
      console.log(trainer.profile_picture);
    });
  }, [trainers]);*/
  useEffect(() => {
    if (location.pathname === '/admin' && location.hash === '#reports') {
      setTabIndex(2);
    }
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCreateReport = () => {
    history.push('/new-report');
  };
  const handleDeleteTrainer = (trainerId) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      axios.delete(`http://localhost:8000/delete-trainer/${trainerId}/`)
        .then(() => {
          setTrainers(trainers.filter(trainer => trainer.id !== trainerId));
          localStorage.setItem('tabIndex', JSON.stringify(tabIndex));
          
          // Reload the page
          window.location.reload();
        })
        .catch(error => {
          console.error('Error deleting trainer:', error.response ? error.response.data : 'Server did not respond');
        });
    }
  };
  
  const handleDeleteTrainee = (userId) => {
    if (window.confirm('Are you sure you want to delete this trainee?')) {
      axios.delete(`http://localhost:8000/delete-trainee/${userId}/`)
        .then(() => {
          setTrainees(trainees.filter(trainee => trainee.id !== userId));
          // Store the current tab index in local storage
          localStorage.setItem('tabIndex', JSON.stringify(tabIndex));
          
          // Reload the page
          window.location.reload();
        })
        .catch(error => {
          console.error('Error deleting trainee:', error.response ? error.response.data : 'Server did not respond');
        });
    }
  };
  const customFontStyle = {
    fontFamily: 'Roboto, sans-serif', // Using Roboto font
    fontSize: '18px',
    color: darkAshGrey,
  };
  useEffect(() => {
    const storedTabIndex = JSON.parse(localStorage.getItem('tabIndex'));
    if (storedTabIndex !== null) {
      setTabIndex(storedTabIndex);
    }
  
    if (location.pathname === '/admin' && location.hash === '#reports') {
      setTabIndex(2);
    }
  }, [location]);
  const renderTrainers = () => (
    <Grid container spacing={2}>
      {trainers.map(trainer => (
        <Grid item xs={12} sm={6} md={4} key={trainer.trainer_id}>
          <Card sx={{ maxWidth: 345, backgroundColor: trainerCardBg }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar alt="Profile Picture" src={`data:image/jpeg;base64,${trainer.profile_picture}`} sx={{ width: 150, height: 150, mb: 2 }} />
              <Typography variant="h6" sx={customFontStyle}>{trainer.user_name}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Specialization: {trainer.specialization}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Telephone Number: {trainer.telephone_number}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Social Media: {trainer.social_media}</Typography>
              <Button variant="contained" color="secondary" onClick={() => handleDeleteTrainer(trainer.trainer_id)}>Delete Trainer</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
  
  
  

  const renderTrainees = () => (
    <Grid container spacing={2}>
      {trainees.map(trainee => (
        <Grid item xs={12} sm={6} md={4} key={trainee.user_id}>
          <Card sx={{ maxWidth: 345, backgroundColor: traineeCardBg }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar alt="Profile Picture" src={`data:image/jpeg;base64,${trainee.profile_picture}`} sx={{ width: 150, height: 150, mb: 2 }} />
              <Typography variant="h6" sx={{ color: darkAshGrey }}>{trainee.user_name}</Typography>
              <Typography variant="body2" sx={customFontStyle}>User ID: {trainee.user_id}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Age: {trainee.age}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Date of Birth: {trainee.date_of_birth}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Gender: {trainee.gender}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Weight: {trainee.weight}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Height: {trainee.height}</Typography>
              <Typography variant="body2" sx={customFontStyle}>Past Achievements: {trainee.past_achievements}</Typography>
              <Button variant="contained" color="secondary" onClick={() => handleDeleteTrainee(trainee.user_id)}>Delete Trainee</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
  

  const renderReports = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Reports</Typography>
      {reports.map(report => (
        <Accordion key={report.Report_ID} sx={{ backgroundColor: lightMintGreen, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1" sx={customFontStyle}>Report ID: {report.Report_ID}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={customFontStyle}>Report Type: {report.Report_Type}</Typography>
            <Typography variant="body2" sx={customFontStyle}>Content: {report.Content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: lightGrey, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, color: darkAshGrey }}>Admin Dashboard</Typography>
      <AppBar position="static" sx={{ backgroundColor: darkMintGreen }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ 
            backgroundColor: darkAshGrey,
            '& .MuiTab-root': {
              color: lightGrey,
              '&:hover': {
                backgroundColor: tabHoverColor,
              },
            },
            '& .Mui-selected': {
              color: lightGrey,
            }
          }}
        >
          <Tab label="View All Trainers" />
          <Tab label="View All Trainees" />
          <Tab label="Reports" />
          <LogoutButton />
        </Tabs>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {tabIndex === 0 && renderTrainers()}
        {tabIndex === 1 && renderTrainees()}
        {tabIndex === 2 && (
          <Box>
            {renderReports()}
            <Button variant="contained" sx={{ mt: 2, backgroundColor: primaryColor }} onClick={handleCreateReport}>Create New Report</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;
