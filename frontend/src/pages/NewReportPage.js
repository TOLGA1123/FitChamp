import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const NewReportPage = () => {
  const [reportType, setReportType] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a POST request to create a new report
    axios.post('http://localhost:8000/new-report/', { report_type: reportType, content })
      .then(response => {
        console.log('New report created:', response.data);
        // Redirect to the reports page after successful creation
        // You can replace '/reports' with the appropriate URL
        window.location.href = '/admin#reports';
      })
      .catch(error => {
        console.error('Error creating new report:', error.response ? error.response.data : 'Server did not respond');
      });
  };

  return (
    <Box>
      <Typography variant="h4">Create New Report</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Report Type"
          variant="outlined"
          fullWidth
          margin="normal"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        />
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default NewReportPage;
