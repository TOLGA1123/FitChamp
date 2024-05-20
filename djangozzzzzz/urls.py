
"""
URL configuration for djangozzzzzz project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from myapp.views import *
from GoalApp.views import *
from NutritionApp.views import *

urlpatterns = [
    path('', schema_view, name='schema'),
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('trainer-signup/', TrainerSignupView.as_view(), name= 'trainer-signup'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('trainer-trainees/', TrainerTraineesView.as_view(), name='trainer-trainees'),
    path('new-trainer/', NewTrainerView.as_view(),name='new-trainer'),
    path('trainers/', UserTrainersView.as_view(), name='trainers'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('goals/', GoalsView.as_view(), name='goals'), 
    path('goal/<str:goal_id>/', GoalDetailView.as_view(), name='goal_detail'), 
    path('new-goal/', NewGoalView.as_view(),name='new-goal'),
    path('new-trainee/', NewTraineeView.as_view(), name='new-trainee'),
    path('nutrition/', NutritionPlanView.as_view(), name='nutrition_plan'),
    path('addmeal/', AddMealView.as_view(), name='add-meal'),
    path('trainee/<str:trainee_Id>/', TraineeView.as_view(), name='trainee_view'),
    path('trainer/<str:trainer_Id>/', TrainerView.as_view(), name='trainer_view'),
    path('sort-goals/', SortGoalsView.as_view(), name='sort-goals'),
    path('goal/<str:goal_id>/delete/', DeleteGoalView.as_view(), name='goal_delete'),
    path('all-trainers/', AllTrainersView.as_view(), name='all_trainers'),
    path('all-trainees/', AllTraineesView.as_view(), name='all_trainees'),
    path('new-report/', NewReportView.as_view(), name='new_report'),
    path('admin-reports/', AdminReportsView.as_view(), name='admin_reports'),
    path('delete-user/<str:user_id>/', DeleteUserView.as_view(), name='delete_user'),
    path('delete-trainer/<str:trainer_id>/', DeleteTrainerView.as_view(), name='delete_trainer'),
    path('delete-trainee/<str:user_id>/', DeleteTraineeView.as_view(), name='delete_trainee'),
    path('change-user-details/<str:user_id>/', ChangeUserDetailsView.as_view(), name='change_user_details'),
    path('workout-plans/', UserWorkouts.as_view(), name = 'workout-plans'),
    path('create-exercise/', CreateExerciseView.as_view(), name='create-exercise'),
    path('create-workout-plan/', CreateWorkoutPlanView.as_view(), name='create-workout-plan'),
    path('exercises/',ExercisesView.as_view(),name='exercises'),
    path('complete-exercises/', CompleteExercisesView.as_view(), name='complete-exercises'),
    path('change-trainer-details/<str:trainer_id>/', ChangeTrainerDetailsView.as_view(), name='change_trainer_details'),
    path('group-sessions/',SessionView.as_view(),name='group-sessions'),
    path('create-session/',CreateSessionView.as_view(),name='group-sessions'),
    path('completed-exercises/<str:routine_name>/', CompletedExercisesView.as_view(), name='completed-exercises'),
    path('delete-workout/', DeleteWorkoutView.as_view(), name='delete-workout'),
    path('auto-update-goals/', AutoUpdateGoalsView.as_view(), name='auto-update-goals'),
    path('all-workouts/', AllWorkouts.as_view(), name='all-workouts'),
    path('select-workout/<str:routine_name>/', SelectWorkout.as_view(), name='select-workout'),
    path('search-goals/', SearchGoalView.as_view(), name='search-goals'),
    path('filter-goals/', FilterGoalsView.as_view(), name='filter-goals'),
    path('is-achievement/', IsAchievementView.as_view(), name='is-achievement'),
    path('achievements/', AchievementsView.as_view(), name='achievements'),
]