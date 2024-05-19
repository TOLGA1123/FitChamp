import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField, Avatar } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ChangeDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [oldProfilePicture, setOldProfilePicture] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:8000/profile/')
            .then(response => {
                setUserDetails(response.data);
                setLoading(false);
                if (response.data.profile_picture) {
                    const base64Image = btoa(String.fromCharCode.apply(null, response.data.profile_picture));
                    setOldProfilePicture(`data:image/jpeg;base64,${base64Image}`);
                }
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProfilePicture(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl); // Set preview URL for new profile picture
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('profile_picture', profilePicture);
        for (const key in userDetails.trainee) {
            formData.append(key, userDetails.trainee[key]);
        }

        axios.put(`http://localhost:8000/change-user-details/${userDetails.user_id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
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
                            {/* Render both old and new profile pictures */}
                            {oldProfilePicture && (
                                <Box>
                                    <Typography variant="body2" sx={{ typography: 'body1' }}>
                                        Old Profile Picture
                                    </Typography>
                                    <Avatar alt="Old Profile Picture" src={oldProfilePicture} sx={{ width: 100, height: 100, marginBottom: 2 }} />
                                </Box>
                            )}
                            {previewUrl && (
                                <Box>
                                    <Typography variant="body2" sx={{ typography: 'body1' }}>
                                        New Profile Picture
                                    </Typography>
                                    <Avatar alt="New Profile Picture" src={previewUrl} sx={{ width: 100, height: 100, marginBottom: 2 }} />
                                </Box>
                            )}
                            <Typography variant="body2" sx={{ marginTop: 2, typography: 'body1' }}>
                                Change Profile Picture
                            </Typography>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={handleFileChange}
                                style={{ margin: '10px 0' }}
                            />
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
            <Box sx={{ p: 3 }}></Box>
        </Box>
    );
};

export default ChangeDetails;
