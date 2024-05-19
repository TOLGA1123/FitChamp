import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const ChangeDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:8000/profile/')
            .then(response => {
                setUserDetails(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user details:', error.response ? error.response.data : 'Server did not respond');
                setLoading(false);
            });
    }, []);

    const handleFieldChange = (field, value) => {
        setUserDetails(prevState => ({
            ...prevState,
            trainee: {
                ...prevState.trainee,
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        const updatedDetails = { ...userDetails.trainee };

        axios.put(`http://localhost:8000/change-user-details/${userDetails.user_id}/`, updatedDetails)
            .then(response => {
                console.log('User details updated successfully:', response.data);
                history.push('/profile');
            })
            .catch(error => {
                console.error('Error updating user details:', error.response ? error.response.data : 'Server did not respond');
            });
    };

    const handleCancel = () => {
        history.push('/profile');
    };

    const renderTextField = (label, value, field) => (
        <TextField
            label={label}
            value={value}
            onChange={e => handleFieldChange(field, e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userDetails) {
        return <div>Error loading user details</div>;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            {renderTextField("Age", userDetails.trainee.age, "age")}
                            {renderTextField("Date of Birth", userDetails.trainee.date_of_birth, "date_of_birth")}
                            {renderTextField("Gender", userDetails.trainee.gender, "gender")}
                            {renderTextField("Weight", userDetails.trainee.weight, "weight")}
                            {renderTextField("Height", userDetails.trainee.height, "height")}
                            {renderTextField("Past Achievements", userDetails.trainee.past_achievements, "past_achievements")}
                            <Button onClick={handleSave} variant="contained" color="primary" sx={{ mr: 2 }}>
                                Save
                            </Button>
                            <Button onClick={handleCancel} variant="contained" color="secondary">
                                Back
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ p: 3 }}>

            </Box>
        </Box>
    );
};

export default ChangeDetails;
