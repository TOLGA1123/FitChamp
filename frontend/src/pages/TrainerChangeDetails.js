import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField, Avatar, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const TrainerChangeDetails = () => {
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [oldProfilePicture, setOldProfilePicture] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:8000/profile/')
            .then(response => {
                setTrainerDetails(response.data);
                setLoading(false);
                if (response.data.profile_picture) {
                    const base64Image = btoa(String.fromCharCode.apply(null, response.data.profile_picture));
                    setOldProfilePicture(`data:image/jpeg;base64,${base64Image}`);
                }
            })
            .catch(error => {
                console.error('Error fetching trainer details:', error.response ? error.response.data : 'Server did not respond');
                setLoading(false);
            });
    }, []);

    const handleFieldChange = (field, value) => {
        setTrainerDetails(prevState => ({
            ...prevState,
            trainer: {
                ...prevState.trainer,
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
        for (const key in trainerDetails.trainer) {
            formData.append(key, trainerDetails.trainer[key]);
        }

        axios.put(`http://localhost:8000/change-trainer-details/${trainerDetails.trainer.trainer_id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('Trainer details updated successfully:', response.data);
            setSuccessMessage(true); // Show success message
            setTimeout(() => {
                history.push(`/trainer-profile/${trainerDetails.trainer.trainer_id}/`);
            }, 1000);
        })
        .catch(error => {
            console.error('Error updating trainer details:', error.response ? error.response.data : 'Server did not respond');
        });
    };

    const handleCancel = () => {
        history.push(`/trainer-profile/${trainerDetails.trainer.trainer_id}/`);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessMessage(false);
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

    if (!trainerDetails) {
        return <div>Error loading trainer details</div>;
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
                            {renderTextField("Specialization", trainerDetails.trainer.specialization, "specialization")}
                            {renderTextField("Telephone Number", trainerDetails.trainer.telephone_number, "telephone_number")}
                            {renderTextField("Social Media", trainerDetails.trainer.social_media, "social_media")}
                            <Button onClick={handleSave} variant="contained" color="primary" sx={{ mr: 2 }}>
                                Save
                            </Button>
                            <Button onClick={handleCancel} variant="contained" color="secondary">
                                Don't Save
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar
                open={successMessage}
                autoHideDuration={1000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Trainer details updated successfully!
                </Alert>
            </Snackbar>
            <Box sx={{ p: 3 }}></Box>
        </Box>
    );
};

export default TrainerChangeDetails;
