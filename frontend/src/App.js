import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TrainerSignUp from './pages/TrainerSignUp';
import CurrentWorkoutPlans from './pages/CurrentWorkoutPlans';
import UserProfile from './pages/UserProfile';
import TrainersPage from './pages/TrainersPage';
import NewWorkoutPlan from './pages/NewWorkoutPlan';

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/trainer-signup" component={TrainerSignUp} />
          <Route path="/workout-plans" component={CurrentWorkoutPlans} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/trainers" component={TrainersPage} />
          <Route path="/new-workout" component={NewWorkoutPlan} />
          {/* You can add more routes here if you have other pages */}
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;