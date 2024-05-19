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
    def get(self,request):
        print("GoalsView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items()) 

        if user_id and username and email:
            try:    
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT fg.*, t.user_name AS trainer_name
                        FROM fitnessgoal fg
                        LEFT JOIN trainer t ON fg.Trainer_ID = t.Trainer_ID
                        WHERE fg.User_ID = %s
                    """, [user_id])
                    goals = cursor.fetchall()
   
                if goals:
                    goals_list = [{'id': goal[0],'user_id': goal[1],'trainer_id': goal[2], 'name': goal[3], 'type': goal[4],'value': goal[5],'start_date': goal[6],'end_date': goal[7],'status': goal[8],'trainer_name': goal[9]} for goal in goals]
                    return Response(goals_list, status=status.HTTP_200_OK)
                else:
                    return Response({'error':'Goal does not exist'},status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)        

    
class GoalDetailView(APIView):
    def get(self,request,goal_id):
        goal_id = str(goal_id).strip()
        print("GoalDetailView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items()) 

        if user_id and username and email:
            try:    
                with connection.cursor() as cursor:
                    
                    print(f"Executing SQL query with User_ID: {user_id.strip()}, Goal_ID: {goal_id}, wdawedawef")

                    cursor.execute("""
                        SELECT fg.*, t.user_name AS trainer_name
                        FROM fitnessgoal fg
                        LEFT JOIN trainer t ON fg.Trainer_ID = t.Trainer_ID
                        WHERE fg.User_ID = %s AND fg.Goal_ID = %s
                    """, [user_id, goal_id])
                    goal = cursor.fetchone()

                print(f"SQL query result: {goal}")

                if goal:
                    goal_data = {
                        'id': goal[0],
                        'user_id': goal[1],
                        'trainer_id': goal[2],
                        'name': goal[3],
                        'type': goal[4],
                        'value': goal[5],
                        'start_date': goal[6],
                        'end_date': goal[7],
                        'status': goal[8],
                        'trainer_name': goal[9]
                    }
                    return Response(goal_data, status=status.HTTP_200_OK)
                else:
                    print(f"Goal with ID {goal_id} does not exist.")
                    return Response({'error':'Goal does not exist'},status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)        


class NewGoalView(APIView):
    def post(self,request):
        print("GoalDetailView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items()) 

        goal_id = generate_unique_id()
        trainer_id = request.data.get('trainer_id')
        goal_name = request.data.get('name')
        goal_type = request.data.get('type')
        goal_value = request.data.get('value')
        start_date = request.data.get('startDate')
        end_date = request.data.get('endDate')
        statusg = request.data.get('status')
        routine_name = request.data.get('Routine_Name')

        print(f"Received Data: goal_id={goal_id}, user_id={user_id}, trainer_id={trainer_id}, goal_name={goal_name}, goal_type={goal_type}, goal_value={goal_value}, start_date={start_date}, end_date={end_date}, status={statusg}, Routine_Name = {routine_name}")

        if user_id and username and email: 
            try:
                with connection.cursor() as cursor:
                    cursor.execute("""
                    INSERT INTO fitnessgoal (Goal_ID, User_ID, Trainer_ID, Goal_Name, Goal_Type, Goal_Value, Start_Date, End_Date, Status, Routine_Name)
                    VALUES (%s, %s, %s, %s, %s, %s, %s ,%s ,%s,%s)
                """,[goal_id, user_id, trainer_id , goal_name, goal_type, goal_value, start_date, end_date, statusg, routine_name])

                    connection.commit()
                return Response({"message": "New Goal Created"}, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                connection.rollback()
                return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                connection.rollback()
                return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
                          
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
                    if sort_criteria == 'value':
                        cursor.execute("""
                            SELECT fg.*, t.user_name AS trainer_name
                            FROM fitnessgoal fg
                            LEFT JOIN trainer t ON fg.trainer_id = t.trainer_id
                            WHERE fg.user_id = %s
                            ORDER BY fg.goal_value
                        """, [user_id])
                    elif sort_criteria == 'endDate':
                        cursor.execute("""
                            SELECT fg.*, t.user_name AS trainer_name
                            FROM fitnessgoal fg
                            LEFT JOIN trainer t ON fg.trainer_id = t.trainer_id
                            WHERE fg.user_id = %s
                            ORDER BY fg.end_date
                        """, [user_id])
                    elif sort_criteria == 'trainerName':
                        cursor.execute("""
                            SELECT fg.*, t.user_name AS trainer_name
                            FROM fitnessgoal fg
                            LEFT JOIN trainer t ON fg.trainer_id = t.trainer_id
                            WHERE fg.user_id = %s
                            ORDER BY t.user_name
                        """, [user_id])
                    else:
                        return Response({"error": "Invalid sort criteria"}, status=status.HTTP_400_BAD_REQUEST)

                    goals = cursor.fetchall()

                if goals:
                    goals_list = [{'id': goal[0],'user_id': goal[1],'trainer_id': goal[2], 'name': goal[3], 'type': goal[4],'value': goal[5],'start_date': goal[6],'end_date': goal[7],'status': goal[8], 'trainer_name': goal[9]} for goal in goals]
                    return Response(goals_list, status=status.HTTP_200_OK)
                else:
                    return Response({'error':'Goal does not exist'},status=status.HTTP_404_NOT_FOUND)
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