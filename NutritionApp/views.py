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
                    # Fetch nutrition plan details
                    cursor.execute("""
                        SELECT NutritionPlan_ID, User_ID, Total_Calories
                        FROM nutrition_plan
                        WHERE User_ID = %s
                    """, [user_id])
                    nutrition_plan = cursor.fetchone()

                    if not nutrition_plan:
                        return Response({'error':'Nutrition plan does not exist'},status=status.HTTP_404_NOT_FOUND)
                    
                    nutrition_plan_id, user_id, total_calories = nutrition_plan

                    # Fetch all meals associated with the nutrition plan
                    cursor.execute("""
                        SELECT m.Meal_name, m.Calories, m.Description, d.Eaten
                        FROM Meal m
                        JOIN Diet d ON m.Meal_name = d.Meal_name
                        WHERE d.NutritionPlan_ID = %s AND d.User_ID = %s
                    """, [nutrition_plan_id, user_id])
                    meals = cursor.fetchall()

                if meals:
                    meals_list = [
                        {
                            'meal_name': meal[0],
                            'calories': meal[1],
                            'description': meal[2],
                        } 
                        for meal in meals
                    ]
                    response_data = {
                        'nutrition_plan_id': nutrition_plan_id,
                        'user_id': user_id,
                        'total_calories': total_calories,
                        'meals': meals_list
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    response_data = {
                        'nutrition_plan_id': nutrition_plan_id,
                        'user_id': user_id,
                        'total_calories': total_calories,
                        'meals': []
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)  
        

class AddMealView(APIView):
    def post(self, request):
        print("AddMealView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items())

        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        meal_name = request.data.get('meal_name')
        calories = request.data.get('calorie_count')
        description = request.data.get('description')

        if not meal_name or not calories or not description:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Insert the new meal into the Meal table
                cursor.execute("""
                    INSERT INTO Meal (User_ID, Meal_name, Calories, Description)
                    VALUES (%s, %s, %s, %s)
                """, [user_id, meal_name, calories, description])

                # Fetch the user's nutrition plan ID
                cursor.execute("SELECT NutritionPlan_ID FROM nutrition_plan WHERE User_ID = %s", [user_id])
                nutrition_plan_id = cursor.fetchone()

                if not nutrition_plan_id:
                    return Response({"error": "Nutrition plan not found for the user."}, status=status.HTTP_404_NOT_FOUND)

                nutrition_plan_id = nutrition_plan_id[0]

                # Insert the new entry into the Diet table
                cursor.execute("""
                    INSERT INTO Diet (Meal_name, NutritionPlan_ID, User_ID, Eaten)
                    VALUES (%s, %s, %s, %s)
                """, [meal_name, nutrition_plan_id, user_id, True])

                # Update the total calories in the nutrition_plan table
                cursor.execute("""
                    UPDATE nutrition_plan
                    SET Total_Calories = Total_Calories + %s
                    WHERE NutritionPlan_ID = %s
                """, [calories, nutrition_plan_id])

                connection.commit()
                return Response({"message": "New meal added and linked to nutrition plan"}, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            connection.rollback()
            return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            connection.rollback()
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
