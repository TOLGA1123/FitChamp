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


def generate_unique_id():
    # Generate a UUID4 and get the first 11 characters
    unique_id = str(uuid.uuid4()).replace("-", "")[:11]
    return unique_id




class GoalsView(APIView):
    def get(self, request):
        print("GoalsView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items())

        if user_id and username and email:
            try:
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT Goal_ID, User_ID, Goal_Name, Goal_Type, initial_value ,current_value, target_value, Start_Date, End_Date, achieved
                        FROM fitnessgoal
                        WHERE User_ID = %s
                    """, [user_id])
                    goals = cursor.fetchall()

                if goals:
                    goals_list = [
                        {
                            'goal_id': goal[0],
                            'user_id': goal[1],
                            'goal_name': goal[2],
                            'goal_type': goal[3],
                            'initial_value': goal[4],
                            'current_value': goal[5],
                            'target_value': goal[6],
                            'start_date': goal[7],
                            'end_date': goal[8],
                            'achieved': goal[9]
                        } 
                        for goal in goals
                    ]
                    return Response(goals_list, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'No goals found for the user'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

    
class GoalDetailView(APIView):
    def get(self, request, goal_id):
        goal_id = str(goal_id).strip()
        print("GoalDetailView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items())

        if user_id and username and email:
            try:
                with connection.cursor() as cursor:
                    print(f"Executing SQL query with User_ID: {user_id.strip()}, Goal_ID: {goal_id}")

                    cursor.execute("""
                        SELECT Goal_ID, User_ID, Goal_Name, Goal_Type, initial_value, current_value, target_value, Start_Date, End_Date, achieved
                        FROM fitnessgoal
                        WHERE User_ID = %s AND Goal_ID = %s
                    """, [user_id, goal_id])
                    goal = cursor.fetchone()

                print(f"SQL query result: {goal}")

                if goal:
                    goal_data = {
                        'goal_id': goal[0],
                        'user_id': goal[1],
                        'goal_name': goal[2],
                        'goal_type': goal[3],
                        'initial_value': goal[4],
                        'current_value': goal[5],
                        'target_value': goal[6],
                        'start_date': goal[7],
                        'end_date': goal[8],
                        'achieved': goal[9]
                    }
                    return Response(goal_data, status=status.HTTP_200_OK)
                else:
                    print(f"Goal with ID {goal_id} does not exist.")
                    return Response({'error': 'Goal does not exist'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)   


class NewGoalView(APIView):
    def post(self, request):
        print("GoalDetailView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items()) 

        goal_id = generate_unique_id()
        goal_name = request.data.get('goal_name')
        goal_type = request.data.get('goal_type')

        target_value = request.data.get('target_value')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        achieved = request.data.get('achieved', False)
        current_value = 0

        print(f"Received Data: goal_id={goal_id}, user_id={user_id}, goal_name={goal_name}, goal_type={goal_type}, target_value={target_value}, start_date={start_date}, end_date={end_date}, achieved={achieved}")

        if user_id and username and email: 
            try:
                with connection.cursor() as cursor:
                    if goal_type.lower() in ['weight loss', 'muscle gain']:
                        # Fetch the user's current weight
                        cursor.execute("SELECT Weight FROM trainee WHERE User_ID = %s", [user_id])
                        result = cursor.fetchone()
                        if result:
                            current_value = result[0]  # Set current_value to the user's weight
                            initial_value = current_value

                    cursor.execute("""
                        INSERT INTO fitnessgoal (Goal_ID, User_ID, Goal_Name, Goal_Type, initial_value, current_value, target_value, Start_Date, End_Date, achieved)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, [goal_id, user_id, goal_name, goal_type, initial_value, current_value, target_value, start_date, end_date, achieved])
                    connection.commit()
                return Response({"message": "New Goal Created"}, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                connection.rollback()
                return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                connection.rollback()
                return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
                          
class SortGoalsView(APIView):
    def get(self, request):
        print("SortGoalsView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        sort_criteria = request.query_params.get('sort_by', 'value')
        print('Session data set:', request.session.items())

        if user_id and username and email:
            try:
                with connection.cursor() as cursor:
                    if sort_criteria == 'endDate':
                        cursor.execute("""
                            SELECT Goal_ID, User_ID, Goal_Name, Goal_Type, initial_value, current_value, target_value, Start_Date, End_Date, achieved
                            FROM fitnessgoal
                            WHERE User_ID = %s
                            ORDER BY End_Date
                        """, [user_id])
                    elif sort_criteria == 'startDate':
                        cursor.execute("""
                            SELECT Goal_ID, User_ID, Goal_Name, Goal_Type, initial_value, current_value, target_value, Start_Date, End_Date, achieved
                            FROM fitnessgoal
                            WHERE User_ID = %s
                            ORDER BY Start_Date
                        """, [user_id])
                    elif sort_criteria == 'GoalName':
                        cursor.execute("""
                            SELECT Goal_ID, User_ID, Goal_Name, Goal_Type, initial_value, current_value, target_value, Start_Date, End_Date, achieved
                            FROM fitnessgoal
                            WHERE User_ID = %s
                            ORDER BY Goal_Name
                        """, [user_id])
                    elif sort_criteria == 'progress':
                        cursor.execute("""
                            SELECT Goal_ID, User_ID, Goal_Name, Goal_Type, initial_value, current_value, target_value, Start_Date, End_Date, achieved,
                                   ABS(current_value - initial_value) / NULLIF(ABS(target_value - initial_value), 0) AS progress
                            FROM fitnessgoal
                            WHERE User_ID = %s
                            ORDER BY progress
                        """, [user_id])
                    else:
                        return Response({"error": "Invalid sort criteria"}, status=status.HTTP_400_BAD_REQUEST)

                    goals = cursor.fetchall()

                if goals:
                    goals_list = [
                        {
                            'goal_id': goal[0],
                            'user_id': goal[1],
                            'goal_name': goal[2],
                            'goal_type': goal[3],
                            'initial_value': goal[4],
                            'current_value': goal[5],
                            'target_value': goal[6],
                            'start_date': goal[7],
                            'end_date': goal[8],
                            'achieved': goal[9],
                            'progress': goal[10] if len(goal) > 10 else None  # Include progress if available
                        }
                        for goal in goals
                    ]
                    return Response(goals_list, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'No goals found for the user'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)


class DeleteGoalView(APIView):
    def delete(self, request, goal_id):
        goal_id = str(goal_id).strip()
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM fitnessgoal
                    WHERE user_id = %s AND goal_id = %s
                """, [user_id, goal_id])
                connection.commit()

            return Response({"message": "Goal deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AutoUpdateGoalsView(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                # Fetch user weight if needed
                cursor.execute("SELECT Weight FROM trainee WHERE User_ID = %s", [user_id])
                user_weight_result = cursor.fetchone()
                user_weight = user_weight_result[0] if user_weight_result else None

                # Fetch goals
                cursor.execute("""
                    SELECT Goal_ID, Goal_Type, initial_value
                    FROM fitnessgoal
                    WHERE User_ID = %s
                """, [user_id])
                goals = cursor.fetchall()

                # Update current values based on goal type
                for goal in goals:
                    goal_id, goal_type, initial_value = goal
                    if goal_type.lower() in ['weight loss', 'muscle gain'] and user_weight is not None:
                        current_value = user_weight
                    else:
                        current_value = current_value  # Default behavior for other types

                    cursor.execute("""
                        UPDATE fitnessgoal
                        SET current_value = %s
                        WHERE Goal_ID = %s AND User_ID = %s
                    """, [current_value, goal_id, user_id])

                connection.commit()

            return Response({"message": "Goals updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            connection.rollback()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)