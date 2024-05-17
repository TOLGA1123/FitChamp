from django.shortcuts import render

import psycopg2
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
from .serializer import *

from datetime import datetime


# Create your views here.

class ReactView(APIView):
    serializer_class = ReactSerializer

    def get(self, request):
        detail = [{"name": detail.name, "detail": detail.detail}
                  for detail in React.objects.all()]
        return Response(detail)

    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


def runschema(sql_file, cur):
    # Read SQL file
    with open(sql_file, 'r') as file:
        sql_statement = file.read()
        cur.execute(sql_statement)
    print("SQL script executed successfully.")

def schema_view(request):
    try:
        with connection.cursor() as cursor:
            runschema('myapp/schema.sql', cursor)
            connection.commit()
        return redirect('login')
    except Exception as e:
        return HttpResponse("Failed to apply schema: {}".format(e))

def generate_user_id():
    # Count the number of existing users
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM userf")
        num_users = cursor.fetchone()[0]

    # Generate user_id by adding 1 to the count and padding it with zeros
    user_id = str(1000000000 + num_users + 1)[-11:]

    return user_id

def generate_trainer_id():

    # Count the number of existing trainers
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM trainer")
        num_trainers = cursor.fetchone()[0]

    # Generate trainer_id by adding 1 to the count and padding it with zeros
    trainer_id = str(1000000000 + num_trainers + 1)[-11:]

    return trainer_id


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]

def dictfetchone(cursor):
    "Return one row from a cursor as a dict"
    desc = cursor.description
    row = cursor.fetchone()
    return dict(zip([col[0] for col in desc], row)) if row else None

def calculate_age(born):
    today = datetime.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

class RegisterView(APIView):
    def post(self, request):
        user_id = generate_user_id()
        user_name = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        date_of_birth = request.data.get('dateOfBirth')
        gender = request.data.get('gender')
        weight = request.data.get('weight')
        height = request.data.get('height')
        past_achievements = request.data.get('past_achievements')

        # Convert date_of_birth from string to datetime
        try:
            date_of_birth_dt = datetime.strptime(date_of_birth, '%Y-%m-%d')
            age = calculate_age(date_of_birth_dt)
        except ValueError:
            return Response({"error": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Insert into userf table
                cursor.execute("""
                    INSERT INTO userf (User_ID, User_name, Password, Email)
                    VALUES (%s, %s, %s, %s)
                """, [user_id, user_name, password, email])

                # Insert into trainee table
                cursor.execute("""
                    INSERT INTO trainee (User_ID, User_name, Password, Age, Date_of_Birth, Gender, Weight, Height, Past_Achievements)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [user_id, user_name, password, age, date_of_birth, gender, weight, height, past_achievements])
                connection.commit()
            return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            connection.rollback()
            return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            connection.rollback()
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TrainerSignupView(APIView):
    def post(self, request):
        user_id = generate_user_id()
        trainer_id = generate_trainer_id()
        user_name = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        specialization = request.data.get('specialization')
        phone_number = request.data.get('phone')
        social_media = request.data.get('socialMedia')

        try:
            with connection.cursor() as cursor:
                # Insert into userf table
                cursor.execute("""
                    INSERT INTO userf (User_ID, User_name, Password, Email)
                    VALUES (%s, %s, %s, %s)
                """, [user_id, user_name, password, email])

                # Insert into trainee table
                cursor.execute("""
                    INSERT INTO trainer (User_ID, Trainer_ID, User_name,  Password, Specialization, Telephone_Number, Social_Media)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, [user_id, trainer_id, user_name, password, specialization, phone_number, social_media])
                connection.commit()
            return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            connection.rollback()
            return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            connection.rollback()
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Execute raw SQL SELECT statement
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM userf WHERE User_name = %s", [username])
            user_row = cursor.fetchone()

        if user_row:
            stored_password = user_row[2]  # Assuming password is stored in the third column
            if password == stored_password:
                # User authenticated
                # User authenticated, store user details in session
                request.session['user_id'] = user_row[0]
                request.session['username'] = user_row[1]
                request.session['email'] = user_row[3]
                request.session.save()
                print("LoginView - Session Key:", request.session.session_key)
                print('Session data set:', request.session.items())  # Debug statement
                return Response({"message": "Login successful."}, status=status.HTTP_200_OK)
            else:
                # Invalid password
                return Response({"error": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            # User not found
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        # Optionally provide a message for GET requests
        return Response({"message": "Please send POST request with username and password."})

class UserProfileView(APIView):

    def get(self, request):

        print("UserProfileView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items())  # Debug statement

        if user_id and username and email:
            try:
                print(user_id)
                with connection.cursor() as cursor:
                    # Fetch the trainee details
                    cursor.execute("""
                        SELECT  Age ,Date_of_Birth, Gender, Weight, Height, Past_Achievements 
                        FROM trainee 
                        WHERE User_ID = %s
                    """, [user_id])
                    trainee = dictfetchone(cursor)
                print(trainee)
                if trainee:
                    user_details = {
                        'user_id': user_id,
                        'username': username,
                        'email': email,
                        'trainee': trainee,
                    }
                    return Response(user_details, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Trainee details not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)


@login_required(login_url='/login/')
def home(request):
    with connection.cursor() as cursor:
        # SQL query to retrieve all users
        cursor.execute("SELECT * FROM userf")
        users = cursor.fetchall()

        # SQL query to retrieve all trainers
        cursor.execute("SELECT * FROM trainer")
        trainers = cursor.fetchall()

    # Convert query results into a more manageable format, if necessary
    user_list = [{'user_id': user[0], 'user_name': user[1], 'password': user[2], 'email': user[3]} for user in users]
    trainer_list = [{'user_id': trainer[0], 'trainer_id': trainer[1], 'user_name': trainer[2], 'password': trainer[3], 'specialization': trainer[4], 'telephone_number': trainer[5], 'social_media': trainer[6]} for trainer in trainers]

    return render(request, 'home.html', {'users': user_list, 'trainers': trainer_list})

@login_required(login_url='/login/')
def user_info(request, user_id):
    try:
        with connection.cursor() as cursor:
            # Fetch the user
            cursor.execute("SELECT * FROM userf WHERE User_ID = %s", [user_id])
            user = dictfetchone(cursor)
            if not user:
                raise Http404("User not found")

            # Fetch trainers associated with the user
            cursor.execute("SELECT * FROM trainer WHERE User_ID = %s", [user_id])
            trainers = cursor.fetchall()

            # Fetch workout plans associated with the user
            cursor.execute("SELECT * FROM workout_plan WHERE User_ID = %s", [user_id])
            workout_plans = cursor.fetchall()

            # Fetch nutrition plans associated with the user
            cursor.execute("SELECT * FROM nutrition_plan WHERE User_ID = %s", [user_id])
            nutrition_plans = cursor.fetchall()

            # Fetch achievements associated with the user
            cursor.execute("SELECT * FROM achievement WHERE User_ID = %s", [user_id])
            achievements = cursor.fetchall()

            # Fetch progress records associated with the user
            cursor.execute("SELECT * FROM progress WHERE User_ID = %s", [user_id])
            progresses = cursor.fetchall()

    except Exception as e:
        raise Http404("Database error: " + str(e))

    context = {
        'user': user,
        'trainers': trainers,
        'workout_plans': workout_plans,
        'nutrition_plans': nutrition_plans,
        'achievements': achievements,
        'progresses': progresses,
    }
    return render(request, 'userinfo.html', context)

class UserWorkouts(APIView):
     
     def get(self, request):

        #print("UserProfileView - Session Key:", request.session.session_key)

        user_id = request.session.get('user_id')
        routine_name = request.session.get('username')
        description = request.session.get('email')

        if user_id:
            try:
                print(user_id)
                with connection.cursor() as cursor:
                    # Fetch the trainee details
                    cursor.execute("""
                        SELECT  Routine_Name ,Description
                        FROM Workout Plan 
                        WHERE User_ID = %s
                    """, [user_id])
                    workout = dictfetchone(workout)
                print(workout)

                if workout:
                    workout_details = {
                        'Routine_Name': routine_name,
                        'Description': description,
                    }
                    return Response(workout_details, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Trainee details not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

    

class CreateWorkoutPlanView(APIView):
    def post(self, request):
        user_id = request.session.get('user_id')

        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        trainer_name = request.data.get('trainer')
        trainee_name = request.data.get('trainee')
        routine_name = request.data.get('routineName')
        duration = request.data.get('duration')
        difficulty = request.data.get('difficulty')
        description = request.data.get('description')  # This should be a list of exercises

        if not trainer_name or not trainee_name or not routine_name or not duration or not description:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Fetch the trainer_id and trainee_id based on names
                cursor.execute("SELECT User_ID FROM User WHERE username = %s", [trainer_name])
                trainer_id = cursor.fetchone()[0]
                cursor.execute("SELECT User_ID FROM User WHERE username = %s", [trainee_name])
                trainee_id = cursor.fetchone()[0]

                # Insert into workout_plan table
                cursor.execute("""
                    INSERT INTO workout_plan (Routine_Name, Trainer_ID, User_ID, Description, Duration, Difficulty_Level)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, [routine_name, trainer_id, trainee_id, f"A {routine_name} workout plan", duration, difficulty])

                # Insert exercises into the Forms table
                for exercise in description:
                    exercise_name = exercise['name']
                    cursor.execute("""
                        INSERT INTO Forms (Exercise_name, Routine_name, Trainer_ID, User_ID)
                        VALUES (%s, %s, %s, %s)
                    """, [exercise_name, routine_name, trainer_id, trainee_id])

                connection.commit()
                return Response({"message": "Workout plan created successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            connection.rollback()
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateExerciseView(APIView):
    def post(self, request):
        print("CreateExerciseView- Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items()) 
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        name = request.data.get('name')
        exercise_type = request.data.get('type')
        description = request.data.get('description')
        muscle_group = request.data.get('muscleGroup')
        equipment = request.data.get('equipment')
        difficulty = request.data.get('difficulty')

        if not name or not exercise_type or not description or not muscle_group or not equipment or not difficulty:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Insert the new exercise into the Exercise table
                cursor.execute("""
                    INSERT INTO Exercise (User_ID, Exercise_name, Description, Muscle_Group_Targeted, Equipment, Difficulty_Level)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, [user_id, name, description, muscle_group, equipment, difficulty])
                connection.commit()

                return Response({"message": "New workout Plan Created"}, status=status.HTTP_200_OK)

        except IntegrityError as e:
                connection.rollback()
                return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
                connection.rollback()
                return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExercisesView(APIView):
    def get(self,request):
        print("ExercisesView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items()) 

        if user_id and username and email:
            try:    
                with connection.cursor() as cursor:
                
                    cursor.execute("""
                        SELECT *
                        FROM Exercise
                        WHERE User_ID = %s
                    """, [user_id])
                    exercises = cursor.fetchall()

                if exercises:
                    exercises_list = [{'user_id': exercise[0],'Exercise_name': exercise[1],'Description': exercise[2], 'Muscle_Group_Targeted': exercise[3], 'Equipment': exercise[4],'Difficulty_Level': exercise[5]}for exercise in exercises]
                    return Response(exercises_list, status=status.HTTP_200_OK)
                else:
                    return Response({'error':'Exercise does not exist'},status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)  
            
        
        





