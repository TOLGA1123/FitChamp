// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Update the import paths according to the new 'pages' folder
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TrainerSignUp from './pages/TrainerSignUp';
import CurrentWorkoutPlans from './pages/CurrentWorkoutPlans';
import UserProfile from './pages/UserProfile';
import TrainersPage from './pages/TrainersPage';
import NewWorkoutPlan from './pages/NewWorkoutPlan';
import TrainerProfile from './pages/TrainerProfile';

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/trainer-signup" component={TrainerSignUp} />
          <Route path="/workout-plans" component={CurrentWorkoutPlans} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/trainers" component={TrainersPage} />
          <Route path="/new-workout" component={NewWorkoutPlan} />
          <Route path="/trainer-profile/:trainerId" component={TrainerProfile} />
          {/* You can add more routes here if you have other pages */}
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;