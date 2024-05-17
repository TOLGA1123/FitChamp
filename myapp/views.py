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
from rest_framework.exceptions import NotFound
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

def generate_goal_id():
    # Count the number of existing users
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM fitnessgoal")
        num_goals = cursor.fetchone()[0]

    # Generate user_id by adding 1 to the count and padding it with zeros
    goal_id = str(1000000000 + num_goals + 1)[-11:]

    return goal_id


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

        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trainer WHERE user_name = %s", [username])
            trainer_row = cursor.fetchone()

        if user_row:
            if trainer_row:
                stored_password = trainer_row[3]  # Assuming password is stored in the third column
                print(stored_password)
                if password == stored_password:
                    # User authenticated
                    # User authenticated, store user details in session
                    request.session['user_id'] = trainer_row[0]
                    request.session['trainer_id'] = trainer_row[1]
                    request.session['username'] = trainer_row[2]
                    request.session['email'] = trainer_row[6]
                    request.session['type'] = 2
                    request.session['spe'] = trainer_row[4]
                    request.session['telephone'] = trainer_row[5]
                    request.session.save()
                    print("LoginView - Session Key:", request.session.session_key)
                    print('Session data set:', request.session.items())  # Debug statement
                    return Response({2}, status=status.HTTP_200_OK)
                else:
                    # Invalid password
                    return Response({"error": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                stored_password = user_row[2]  # Assuming password is stored in the third column
                if password == stored_password:
                    # User authenticated
                    # User authenticated, store user details in session
                    request.session['user_id'] = user_row[0]
                    request.session['username'] = user_row[1]
                    request.session['email'] = user_row[3]
                    request.session['type'] = 1
                    request.session.save()
                    print("LoginView - Session Key:", request.session.session_key)
                    print('Session data set:', request.session.items())  # Debug statement
                    return Response({1}, status=status.HTTP_200_OK)
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
        if request.session.get('type') == 1:
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
        else:
            print("hohohohohohohohohohohoho")
            print("TrainerProfileView - Session Key:", request.session.session_key)
            user_id = request.session.get('user_id')
            username = request.session.get('username')
            email = request.session.get('email')
            specialization = request.session.get('spe')
            telephone = request.session.get('telephone')
            print('Session data set:', request.session.items())  # Debug statement

            if user_id and username and email:
                try:
                    print(user_id)
                    with connection.cursor() as cursor:
                        # Fetch the trainee details
                        cursor.execute("""
                            SELECT  user_name ,specialization, telephone_number, social_media 
                            FROM trainer 
                            WHERE User_ID = %s
                        """, [user_id])
                        trainer = dictfetchone(cursor)
                        print("tekli hoh")
                    print(trainer)
                    if trainer:
                        user_details = {
                            'user_id': user_id,
                            'username': username,
                            'trainer': trainer
                        }
                        return Response(user_details, status=status.HTTP_200_OK)
                    else:
                        return Response({"error": "Trainee details not found."}, status=status.HTTP_404_NOT_FOUND)
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        # Clear all session data
        request.session.flush()
        return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
class TrainerTraineesView(APIView):
    def get(self,request):
        trainer_id = request.session.get('trainer_id')
        with connection.cursor() as cursor:
            cursor.execute("SELECT user_id FROM trains WHERE trainer_id = %s", [trainer_id])
            trainer_trainees = cursor.fetchall()
        if not trainer_trainees:
            return Response([], status=status.HTTP_200_OK)
        trainee_ids = [row[0] for row in trainer_trainees]
        if trainee_ids:
            trainee_ids_tuple = tuple(trainee_ids)
            with connection.cursor() as cursor:
                query = "SELECT * FROM trainee WHERE user_id IN %s"
                cursor.execute(query, [trainee_ids_tuple])
                trainees = cursor.fetchall()

        trainee_list = [
            {
                'user_id': trainee[0],
                'user_name': trainee[1],
                'password': trainee[2],
                'age': trainee[3],
                'date_of_birth': trainee[4],
                'gender': trainee[5],
                'weight': trainee[6],
                'height': trainee[7],
                'past_achievements': trainee[8]
            }
            for trainee in trainees
        ]

        return Response(trainee_list, status=status.HTTP_200_OK)
class NewTraineeView(APIView):
    def get(self,request):
        trainer_id = request.session.get('trainer_id')
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trains WHERE trainer_id = %s", [trainer_id])
            associated_trainees = cursor.fetchall()
        # Extract the trainer_ids from the fetched rows
        associated_trainee_ids = [row[0] for row in associated_trainees]
        print(associated_trainee_ids)
        if associated_trainee_ids:
            associated_trainee_ids_tuple = tuple(associated_trainee_ids)
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT * FROM trainee WHERE user_id NOT IN %s", 
                    [associated_trainee_ids_tuple]
                )
                trainees = cursor.fetchall()
        else:
            with connection.cursor() as cursor:
                # Fetch all trainees since the user has no associated trainees
                cursor.execute("SELECT * FROM trainee")
                trainees = cursor.fetchall()
        trainees = [{'user_id': trainee[0], 'user_name': trainee[1], 'password': trainee[2], 'age': trainee[3], 'date_of_birth': trainee[4], 'gender': trainee[5], 'weight': trainee[6], 'height': trainee[7], 'past_achievements': trainee[8]} for trainee in trainees]
        #print(trainees)
        return Response(trainees, status=status.HTTP_200_OK)
     # POST method to add the selected trainee to a trainer in the trains table
    def post(self, request):
        # Retrieve user ID and trainer ID from request data
        trainer_id = request.session.get('trainer_id')    #trainer's user id in the session
        trainee_id = request.data.get('user_id')
        print(trainee_id)
        # Check if the user and trainer exist
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trainer WHERE trainer_id = %s", [trainer_id])
            trainer_exists = cursor.fetchone()
            cursor.execute("SELECT * FROM trainee WHERE user_id = %s", [trainee_id])
            trainee_exists = cursor.fetchone()
        print(trainer_exists)
        print(trainee_exists)
        if not trainer_exists:
            raise NotFound(detail="Trainer not found", code=status.HTTP_404_NOT_FOUND)
        if not trainee_exists:
            raise NotFound(detail="Trainee not found", code=status.HTTP_404_NOT_FOUND)

        # Insert the entry into the trains table
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO trains (user_id, trainer_id) VALUES (%s, %s)", [trainee_id, trainer_id])

        return Response({"message": "Trainee added to user successfully."}, status=status.HTTP_201_CREATED)

class UserTrainersView(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User ID not found in session"}, status=status.HTTP_400_BAD_REQUEST)
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT trainer.* FROM trains INNER JOIN trainer ON trains.trainer_id = trainer.trainer_id WHERE trains.user_id = %s", [user_id])
            trainers = cursor.fetchall()
        
        trainer_list = [{
            'trainer_id': trainer[0],
            'user_id': trainer[1],
            'user_name': trainer[2],
            'password': trainer[3],
            'specialization': trainer[4],
            'telephone_number': trainer[5],
            'social_media': trainer[6]
        } for trainer in trainers]
        
        return Response(trainer_list, status=status.HTTP_200_OK)
class NewTrainerView(APIView):
    def get(self,request):
        user_id = request.session.get('user_id')
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trains WHERE user_id = %s", [user_id])
            associated_trainers = cursor.fetchall()
        # Extract the trainer_ids from the fetched rows
        associated_trainer_ids = [row[1] for row in associated_trainers]
        #print(trainer_ids)
        # Fetch all trainers matched with the given trainer_ids
        if associated_trainer_ids:
            associated_trainer_ids_tuple = tuple(associated_trainer_ids)
            with connection.cursor() as cursor:
                # Step 2: Fetch the trainers who are not associated with the user
                cursor.execute(
                    "SELECT * FROM trainer WHERE trainer_id NOT IN %s", 
                    [associated_trainer_ids_tuple]
                )
                trainers = cursor.fetchall()
        else:
            with connection.cursor() as cursor:
                # Fetch all trainers since the user has no associated trainers
                cursor.execute("SELECT * FROM trainer")
                trainers = cursor.fetchall()
        #trainee_list = [{'user_id': trainee[0], 'user_name': trainee[1], 'password': trainee[2], 'email': trainee[3]} for trainee in trainees]
        trainers = [{'user_id': trainer[0], 'trainer_id': trainer[1], 'user_name': trainer[2], 'password': trainer[3], 'specialization': trainer[4], 'telephone_number': trainer[5], 'social_media': trainer[6]} for trainer in trainers]
        print(trainers)
        return Response(trainers, status=status.HTTP_200_OK)
     # POST method to add the selected trainer to a user in the trains table
    def post(self, request):
        # Retrieve user ID and trainer ID from request data
        user_id = request.session.get('user_id')
        trainer_id = request.data.get('trainer_id')

        # Check if the user and trainer exist
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trainee WHERE user_id = %s", [user_id])
            user_exists = cursor.fetchone()
            cursor.execute("SELECT * FROM trainer WHERE trainer_id = %s", [trainer_id])
            trainer_exists = cursor.fetchone()

        if not user_exists:
            raise NotFound(detail="User not found", code=status.HTTP_404_NOT_FOUND)
        if not trainer_exists:
            raise NotFound(detail="Trainer not found", code=status.HTTP_404_NOT_FOUND)

        # Insert the entry into the trains table
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO trains (user_id, trainer_id) VALUES (%s, %s)", [user_id, trainer_id])

        return Response({"message": "Trainer added to user successfully."}, status=status.HTTP_201_CREATED)


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
                        SELECT *
                        FROM fitnessgoal
                        WHERE User_ID = %s
                    """, [user_id])
                    goals = cursor.fetchall()

                if goals:
                    goals_list = [{'id': goal[0],'user_id': goal[1],'trainer_id': goal[2], 'name': goal[3], 'type': goal[4],'value': goal[5],'start_date': goal[6],'end_date': goal[7],'status': goal[8]} for goal in goals]
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
                        SELECT *
                        FROM fitnessgoal
                        WHERE User_ID = %s AND Goal_ID = %s
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
                        'status': goal[8]
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

        goal_id = generate_goal_id()
        trainer_id = '1000000001'
        goal_name = request.data.get('name')
        goal_type = request.data.get('type')
        goal_value = request.data.get('value')
        start_date = request.data.get('startDate')
        end_date = request.data.get('endDate')
        statusg = request.data.get('status')

        if user_id and username and email: 
            try:
                with connection.cursor() as cursor:
                    cursor.execute("""
                    INSERT INTO fitnessgoal (Goal_ID, User_ID, Trainer_ID, Goal_Name, Goal_Type, Goal_Value, Start_Date, End_Date, Status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s ,%s ,%s)
                """,[goal_id, user_id, trainer_id , goal_name, goal_type, goal_value, start_date, end_date, statusg])

                    connection.commit()
                return Response({"message": "New Goal Created"}, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                connection.rollback()
                return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                connection.rollback()
                return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)