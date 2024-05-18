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
    path('trainee/<int:trainee_Id>/', TraineeView.as_view(), name='trainee_view'),
    path('trainer/<int:trainer_Id>/', TrainerView.as_view(), name='trainer_view'),
    path('sort-goals/', SortGoalsView.as_view(), name='sort-goals'),
    path('goal/<str:goal_id>/delete/', DeleteGoalView.as_view(), name='goal_delete'),
    path('all-trainers/', AllTrainersView.as_view(), name='all_trainers'),
    path('all-trainees/', AllTraineesView.as_view(), name='all_trainees'),
]