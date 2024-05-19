// pages/UserProfile.js
import React from 'react';
import { Box, Grid, Paper, Typography, Avatar, List, ListItem, ListItemText, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutButton from './LogoutButton';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavTabs from './NavTabs';
axios.defaults.withCredentials = true;

const UserProfile = () => {
    const history = useHistory();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/profile/')
            .then(response => {
                setUserDetails(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user details:', error.response ? error.response.data : 'Server did not respond');
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    history.push('/');
                }
            });
    }, [history]);

    if (loading) {
        return <div>Loading...</div>; // Display a loading state while fetching user details
    }

    if (!userDetails) {
        return <div>Error loading user details</div>; // Display an error message if user details couldn't be fetched
    }

    const handleRouteChange = (event, newValue) => {
        history.push(`/${newValue}`);
    };
    if (loading) {
        return <div>Loading...</div>; // Display a loading state while fetching user details
      }
    
      if (!userDetails) {
        return <div>Error loading user details</div>; // Display an error message if user details couldn't be fetched
      }
      const handleNewWorkout = () => {
        history.push('/new-workout');
      };
    
      const handleGroupSession = () => {
        history.push('/group-session');
      };
    const handleDeleteUser = () => {
        axios.delete(`http://localhost:8000/delete-user/${userDetails.user_id}/`)
            .then(response => {
                console.log('User deleted successfully:', response.data);
                history.push('/');
            })
            .catch(error => {
                console.error('Error deleting user:', error.response ? error.response.data : 'Server did not respond');
            });
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: green[500] }}>
                <NavTabs activeTab="" />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px', height: '60px' }}>
                    <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Your Profile
                    </Typography>
                </Box>
            </AppBar>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar alt="Profile Picture" src={`data:image/jpeg;base64,${userDetails.profile_picture}`} sx={{ width: 150, height: 150, mb: 2 }} />
                        </Paper>
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={() => history.push('/change-details')}
                                sx={{ mb: 2 }}
                            >
                                Change Details
                            </Button>
                            <Button 
                                variant="contained" 
                                color="error" 
                                onClick={handleDeleteUser}
                            >
                                Delete Account
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">Username:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{userDetails.username}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">Email:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{userDetails.email}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">Age:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{userDetails.trainee.age}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">Date of Birth:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{userDetails.trainee.date_of_birth}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">Gender:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{userDetails.trainee.gender}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">Weight:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{userDetails.trainee.weight}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">Height:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{userDetails.trainee.height}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">Past Achievements:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{userDetails.trainee.past_achievements}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Goals
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="Lose 10 lbs" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Run a marathon" />
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Progress
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="Lost 5 lbs" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Half marathon completed" />
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default UserProfile;
