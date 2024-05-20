from django.shortcuts import render

import psycopg2, base64
from django.db import connection, IntegrityError
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, Http404
import uuid
from django.contrib.sessions.models import Session
from django.shortcuts import render
from rest_framework.views import APIView, status
from .models import *
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from datetime import datetime



# Create your views here.


           
class NutritionPlanView(APIView):
    def get(self, request):
        print("NutritionPlanView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items()) 

        if user_id and username and email:
            try:    
                with connection.cursor() as cursor:
                
                    cursor.execute("""
                        SELECT *
                        FROM nutrition_plan
                        WHERE User_ID = %s
                    """, [user_id])
                    nutrition_plans = cursor.fetchall()

                if nutrition_plans:
                    nutrition_plans_list = [{'name': nutrition_plan[0],'user_id': nutrition_plan[1],'trainer_id': nutrition_plan[2], 'description': nutrition_plan[3], 'total_calories': nutrition_plan[4],'meal_schedule': nutrition_plan[5]} for nutrition_plan in nutrition_plans]
                    return Response(nutrition_plans_list, status=status.HTTP_200_OK)
                else:
                    return Response({'error':'Nutrition plan does not exist'},status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)    
        


class NewNutritionPlanView(APIView):
    def post(self,request, trainee_Id):
        print("NewNutritionPlanView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print(trainee_Id)
        print('Session data set:', request.session.items()) 

        user_id = str(user_id).strip()

        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trainer WHERE user_id = %s", [user_id])
            foundTrainer = cursor.fetchone()
        
        trainer_id = foundTrainer[1]
        trainee_id = trainee_Id
        nutrition_plan_name = request.data.get('name')
        total_calories = request.data.get('total_calories')
        meal_schedule = request.data.get('meal_schedule')
        meals = request.data.get('meals')

        meal_names = [meal['Meal_name'] for meal in meals]

        print(f"Received Data: user_id={user_id}, trainee_id={trainee_id}, nutrition_plan_name={nutrition_plan_name}, nutrition_plan_description={nutrition_plan_description}, nutrition_plan_total_calories={nutrition_plan_total_calories}, meal_schedule={meal_schedule}")

        if user_id and username and email: 
            try:
                with connection.cursor() as cursor:
                    cursor.execute("""
                    INSERT INTO nutrition_plan (nutrition_plan_name, user_id, trainer_id, Meals, total_calories, meal_schedule)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """,[nutrition_plan_name, trainee_id, trainer_id, meal_names, total_calories, meal_schedule])
                    connection.commit()

                print('BBBBBB')

                for meal in meal_names:
                    cursor.execute("""
                        INSERT INTO Diet (Meal_name, Nutrition_Plan_Name, Trainer_ID, User_ID, Eaten)
                        VALUES (%s, %s, %s, %s, %s)
                    """, [meal, nutrition_plan_name, trainer_id, user_id, False])

                return Response({"message": "New Nutrition Plan Created"}, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                connection.rollback()
                return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                connection.rollback()
                return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
