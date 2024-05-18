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
import GoalsPage from './pages/GoalsPage';
import ProgressAchievements from './pages/ProgressAchievements';
import TraineesPage from './pages/TraineesPage';
import GoalDetailPage from './pages/GoalDetailPage';
import NewGoalPage from './pages/NewGoalPage';
import NewTrainerPage from './pages/NewTrainerPage';
import CurrentNutritionPlans from './pages/CurrentNutritionPlans'
import TraineeViewPage from './pages/TraineeViewPage'
import NewTraineePage from './pages/NewTraineePage';
import TrainerViewPage from './pages/TrainerViewPage';
import GroupSessions from './pages/GroupSessions';
import AdminPage from './pages/AdminPage';
import NewReportPage from './pages/NewReportPage';
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
          <Route path="/goals" component={GoalsPage} />
          <Route path="/achievements" component={ProgressAchievements} />
          <Route path="/trainees" component={TraineesPage} />
          <Route path="/goal/:goalId" component={GoalDetailPage} />
          <Route path="/new-goal" component={NewGoalPage} />
          <Route path="/new-trainer" component={NewTrainerPage} />
          <Route path = "/new-trainee" component={NewTraineePage} />
          <Route path="/group-sessions" component={GroupSessions} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/nutrition" component={CurrentNutritionPlans} />
          <Route path="/trainee/:trainee_Id" component={TraineeViewPage} />
          <Route path = "/trainer/:trainer_Id" component={TrainerViewPage} />
          <Route path = "/new-report" component={NewReportPage} />
          {/*
           You can add more routes here if you have other pages */}
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;