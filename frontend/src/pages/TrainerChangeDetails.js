import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const TrainerChangeDetails = () => {
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:8000/profile/')
            .then(response => {
                setTrainerDetails(response.data);
                setLoading(false);
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
    console.log('AAAAAAAAAAAA');
    console.log(trainerDetails);
    const handleSave = () => {
        const updatedDetails = { ...trainerDetails.trainer };
        axios.put(`http://localhost:8000/change-trainer-details/${trainerDetails.trainer.trainer_id}/`, updatedDetails) 
            .then(response => {
                console.log('Trainer details updated successfully:', response.data);
                history.push(`/trainer-profile/${trainerDetails.trainer.trainer_id}/`);
            })
            .catch(error => {
                console.error('Error updating trainer details:', error.response ? error.response.data : 'Server did not respond');
            });
    };

    const handleCancel = () => {
        history.push(`/trainer-profile/${trainerDetails.trainer.trainer_id}/`); 
    };

    const renderTextField = (label, value, field) => (
        <TextField
            label={label}
            value={value}
            onChange={e => handleFieldChange(field, e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary" // Set the color of the text field to primary
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
            <Box sx={{ p: 3 }}>

            </Box>
        </Box>
    );
};

export default TrainerChangeDetails;
