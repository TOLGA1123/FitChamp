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

base_goal_id = 3000000000

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

def generate_unique_id():
    # Generate a UUID4 and get the first 11 characters
    unique_id = str(uuid.uuid4()).replace("-", "")[:11]
    return unique_id

def generate_report_id():
    # Count the number of existing reports
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM report")
        num_reports = cursor.fetchone()[0]

    # Generate report_id by adding 1 to the count and padding it with zeros
    report_id = str(1000000000 + num_reports + 1)[-11:]

    return report_id

''''
def generate_user_id():
    # Count the number of existing users
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM userf")
        num_users = cursor.()[0]

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
'''

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
        user_id = generate_unique_id()
        user_name = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        date_of_birth = request.data.get('dateOfBirth')
        gender = request.data.get('gender')
        weight = request.data.get('weight')
        height = request.data.get('height')
        past_achievements = request.data.get('past_achievements')
        if not user_name or not email or not password or not date_of_birth or not gender or not weight or not height or not past_achievements:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
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
        user_id = generate_unique_id()
        trainer_id = generate_unique_id()
        user_name = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        specialization = request.data.get('specialization')
        phone_number = request.data.get('phone')
        social_media = request.data.get('socialMedia')
         # Check for null or empty fields
        if not user_name or not email or not password or not specialization or not phone_number or not social_media:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
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
            
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM adminf WHERE user_name = %s", [username])
            admin_row = cursor.fetchone()
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
            elif admin_row:
                stored_password = admin_row[2]  # Assuming password is stored in the third column for admin
                if password == stored_password:
                    # Admin authenticated
                    # Store admin details in session
                    request.session['user_id'] = admin_row[0]
                    request.session['username'] = admin_row[1]
                    request.session['email'] = admin_row[4]  # Assuming email is in the fourth column
                    request.session['type'] = 3
                    request.session.save()
                    print("LoginView - Session Key:", request.session.session_key)
                    print('Session data set:', request.session.items())  # Debug statement
                    return Response({3}, status=status.HTTP_200_OK)
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
                            SELECT  Trainer_ID, user_name ,specialization, telephone_number, social_media 
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
            'user_id': trainer[0],
            'trainer_id': trainer[1],
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

        print(f"Received Data: goal_id={goal_id}, user_id={user_id}, trainer_id={trainer_id}, goal_name={goal_name}, goal_type={goal_type}, goal_value={goal_value}, start_date={start_date}, end_date={end_date}, status={statusg}")

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
            
class TraineeView(APIView):
    def get(self, request, trainee_Id):
        print("TraineeView - Session Key:", request.session.session_key)
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
                        SELECT  * 
                        FROM trainee 
                        WHERE User_ID = %s
                    """, [str(trainee_Id)])
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
        
class TrainerView(APIView):
    def get(self, request, trainer_Id):
        print("TrainerView - Session Key:", request.session.session_key)
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
                        SELECT  * 
                        FROM trainer 
                        WHERE trainer_ID = %s
                    """, [str(trainer_Id)])
                    trainer = dictfetchone(cursor)
                print(trainer)
                if trainer:
                    user_details = {
                        'user_id': user_id,
                        'username': username,
                        'email': email,
                        'trainer': trainer,
                    }
                    return Response(user_details, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Trainee details not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

            
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
        

class AllTrainersView(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trainer")
            trainers = cursor.fetchall()

        trainer_list = [{
            'user_id': trainer[0],
            'trainer_id': trainer[1],
            'user_name': trainer[2],
            'password': trainer[3],
            'specialization': trainer[4],
            'telephone_number': trainer[5],
            'social_media': trainer[6]
        } for trainer in trainers]

        return Response(trainer_list, status=status.HTTP_200_OK)
class AllTraineesView(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trainee")
            trainees = cursor.fetchall()

        trainee_list = [{
            'user_id': trainee[0],
            'user_name': trainee[1],
            'password': trainee[2],
            'age': trainee[3],
            'date_of_birth': trainee[4],
            'gender': trainee[5],
            'weight': trainee[6],
            'height': trainee[7],
            'past_achievements': trainee[8],
        } for trainee in trainees]

        return Response(trainee_list, status=status.HTTP_200_OK)

class NewReportView(APIView):
    def post(self, request):
        # Retrieve admin ID from the session or request data, adjust this according to your authentication method
        admin_id = request.session.get('user_id') 

        report_type = request.data.get('report_type')
        content = request.data.get('content')
        
        report_id = generate_report_id()
        # Perform raw SQL query to insert the report into the database
        with connection.cursor() as cursor:
            try:
                # Execute the SQL query to insert the new report
                cursor.execute("""
                    INSERT INTO report (Report_ID, Report_Type, Content) VALUES (%s, %s, %s)
                    """, [report_id, report_type, content]
                )
                # Execute the SQL query to insert into the overview table
                cursor.execute("""
                    INSERT INTO overview (User_ID, Report_ID) VALUES (%s, %s)
                    """, [admin_id, report_id]
                )
            except Exception as e:
                # Handle any database errors
                return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Report created successfully."}, status=status.HTTP_201_CREATED)
class AdminReportsView(APIView):
    def get(self, request):
        admin_id = request.session.get('user_id')
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT Report_ID
                FROM overview
                WHERE User_ID = %s
            """, [admin_id])
            report_ids = cursor.fetchall()

        if not report_ids:
            return Response([], status=status.HTTP_200_OK)
        report_id_list = [row[0] for row in report_ids]

        # Convert the list of report IDs into a tuple
        report_ids_tuple = tuple(report_id_list)

        # Fetch reports from the report table using the retrieved report IDs
        with connection.cursor() as cursor:
            query = """
                SELECT *
                FROM report
                WHERE Report_ID IN %s
            """
            cursor.execute(query, [report_ids_tuple])
            reports = cursor.fetchall()

        # Create a list of dictionaries containing report information
        report_list = [
            {
                'Report_ID': report[0],
                'Report_Type': report[1],
                'Content': report[2],
                # Add more fields as needed
            }
            for report in reports
        ]

        return Response(report_list, status=status.HTTP_200_OK)

def create_group_session(trainer_id, name, location, starting_time, end_time, session_type, max_participants, trainee_ids):
    try:
        with connection.cursor() as cursor:
            # Check if the user is a trainer
            print("ff1")
            
            cursor.execute("SELECT * FROM trainer WHERE Trainer_ID = %s", [trainer_id])
            trainer = cursor.fetchone()
            
            print("ff2")
            if not trainer:
                return {"error": "User is not a trainer."}

            print("check")
            # Generate a unique Group_Session_ID
            group_session_id = generate_unique_id()
            print("check2")

            for trainee_id in trainee_ids:
                print(trainee_id)

            
            print(trainer_id, group_session_id, name, location, starting_time, end_time, session_type, max_participants)
            # Insert the new group session into the Group_Session table
            cursor.execute("""
            INSERT INTO Group_Session (Trainer_ID, Group_Session_ID, Session_name, Location, Starting_Time, End_Time, Type, Max_Participants)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, [trainer_id, group_session_id, name, location, starting_time, end_time, session_type, max_participants])

            

            print("ff3")

            # Insert the new group session into the Group_Sessions table
            for trainee_id in trainee_ids:
                cursor.execute("""
                    INSERT INTO Group_Sessions (User_ID, Group_Session_ID, trainer_id)
                    VALUES (%s, %s, %s)
                """, [trainee_id, group_session_id, trainer_id])

            print("ff4")

            # The below table should be deleted it is useless

            print("ff5")

            connection.commit()
            return {"message": "Group session created successfully."}
    except Exception as e:
        connection.rollback()
        return {"error": f"An error occurred: {str(e)}"}

class CreateSessionView(APIView):

    #ASSUMPTON : TRAINEE IDS ARE PASSED IN FORM OF AN ARRAY FROM FORNTEND
    def post(self, request):
        print("CreateSessionView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        trainer_id = request.session.get('trainer_id')
        print('Session data set:', request.session.items()) 

        trainee_ids = request.data.get('trainee_ids')
        name = request.data.get('name')
        location = request.data.get('location')
        starting_time = request.data.get('startingTime')
        end_time = request.data.get('endTime')
        session_type = request.data.get('type')
        max_participants = request.data.get('maxParticipants')
        


        if not trainer_id:
            return Response({"error": "trainer_id and trainee are required."}, status=status.HTTP_400_BAD_REQUEST)

        result = create_group_session(trainer_id, name, location, starting_time,  end_time, session_type, max_participants, trainee_ids)

        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_201_CREATED)
    

def display_available_sessions(trainer_id):
    try:
        with connection.cursor() as cursor:
           
            #cursor.execute("""
            #    SELECT gs.Group_Session_ID, gs.Trainer_ID, gs.Location, gs.Starting_Time, gs.End_Time, gs.Type, gs.Max_Participants, gs.Price
            #    FROM Group_Session gs
            #    LEFT JOIN (
            #        SELECT Group_Session_ID, COUNT(*) as participant_count
            #        FROM Group_Sessions
            #        GROUP BY Group_Session_ID
            #    ) gs_count ON gs.Group_Session_ID = gs_count.Group_Session_ID
            #    WHERE gs_count.participant_count < gs.Max_Participants OR gs_count.participant_count IS NULL
            #""")

            cursor.execute("SELECT * FROM group_session WHERE trainer_id = %s", [trainer_id])
            
            available_sessions = cursor.fetchall()

            print(available_sessions)

            if available_sessions:
                session_list = [{"trainer_id": session[0], "group_session_id": session[1], "session_name": session[2], "location": session[3], "starting_time": session[4], "end_time": session[5], "session_type": session[6], "max_participants": str(session[7])} for session in available_sessions]

            print(session_list)
            return Response(session_list, status=status.HTTP_200_OK)
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
    

class SessionView(APIView):
    #ASSUMPTON : TRAINEE IDS ARE PASSED IN FORM OF AN ARRAY FROM FORNTEND
    def get(self, request):
        trainer_id = request.session.get('trainer_id')
        try:
            with connection.cursor() as cursor:
           
                #cursor.execute("""
                #    SELECT gs.Group_Session_ID, gs.Trainer_ID, gs.Location, gs.Starting_Time, gs.End_Time, gs.Type, gs.Max_Participants, gs.Price
                #    FROM Group_Session gs
                #    LEFT JOIN (
                #        SELECT Group_Session_ID, COUNT(*) as participant_count
                #        FROM Group_Sessions
                #        GROUP BY Group_Session_ID
                #    ) gs_count ON gs.Group_Session_ID = gs_count.Group_Session_ID
                #    WHERE gs_count.participant_count < gs.Max_Participants OR gs_count.participant_count IS NULL
                #""")

                cursor.execute("SELECT * FROM group_session WHERE trainer_id = %s", [trainer_id])
            
                available_sessions = cursor.fetchall()

                print(available_sessions)

                if available_sessions:
                    session_list = [{"trainer_id": session[0], "group_session_id": session[1], "session_name": session[2], "location": session[3], "starting_time": session[4], "end_time": session[5], "session_type": session[6], "max_participants": str(session[7])} for session in available_sessions]

            print(session_list)
            return Response(session_list, status=status.HTTP_200_OK)
        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}

        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_201_CREATED)
    

def join_session(user_id, group_session_id):
    try:
        with connection.cursor() as cursor:
          
            cursor.execute("""
                SELECT gs.Max_Participants, COALESCE(gs_count.participant_count, 0) as participant_count
                FROM Group_Session gs
                LEFT JOIN (
                    SELECT Group_Session_ID, COUNT(*) as participant_count
                    FROM Group_Sessions
                    GROUP BY Group_Session_ID
                ) gs_count ON gs.Group_Session_ID = gs_count.Group_Session_ID
                WHERE gs.Group_Session_ID = %s
            """, [group_session_id])
            
            session = cursor.fetchone()
            
            if not session:
                return {"error": "Group session not found."}
            
            if session['participant_count'] >= session['Max_Participants']:
                return {"error": "Group session has already reached its maximum limit."}

            # Check if the user is already in the session
            cursor.execute("""
                SELECT * FROM Group_Sessions WHERE User_ID = %s AND Group_Session_ID = %s
            """, [user_id, group_session_id])
            
            if cursor.fetchone():
                return {"error": "User is already in the session."}

            # Insert the user into the Group_Sessions table
            cursor.execute("""
                INSERT INTO Group_Sessions (User_ID, Group_Session_ID)
                VALUES (%s, %s)
            """, [user_id, group_session_id])

            connection.commit()
            return {"message": "User successfully joined the group session."}
    except Exception as e:
        connection.rollback()
        return {"error": f"An error occurred: {str(e)}"}
    
class JoinSessionView(APIView):

    #ASSUMPTON : TRAINEE IDS ARE PASSED IN FORM OF AN ARRAY FROM FORNTEND
    def post(self, request):

        trainee_ids = request.data.get('trainee_ids')
        trainer = request.user
        location = request.data.get('location')
        starting_time = request.data.get('starting_time')
        end_time = request.data.get('end_time')
        session_type = request.data.get('session_type')
        max_participants = request.data.get('max_participants')
        price = request.data.get('price')


        if not trainer or not trainee_ids:
            return Response({"error": "trainer_id and trainee are required."}, status=status.HTTP_400_BAD_REQUEST)

        result = join_session(user_id, group_session_id)

        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_201_CREATED)
    

def display_workouts(user_id):
    try:
        with connection.cursor() as cursor:
            
            cursor.execute("""
                SELECT wp.Routine_Name, wp.Description, wp.Duration, wp.Difficulty_Level
                FROM workout_plan wp
                JOIN assigned a ON wp.Routine_Name = a.Routine_name AND wp.Trainer_ID = a.Trainer_ID AND wp.User_ID = a.User_ID
                WHERE wp.User_ID = %s
            """, [user_id])
            
            workouts = cursor.fetchall()
            
            if not workouts:
                return {"error": "No current workouts found for the user."}
            
            return {"workouts": workouts}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


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
        
        user_id = foundTrainer[1]

        trainee_id = trainee_Id
        nutrition_plan_name = request.data.get('name')
        nutrition_plan_description = request.data.get('description')
        nutrition_plan_total_calories = request.data.get('total_calories')
        meal_schedule = request.data.get('meal_schedule')

        print(f"Received Data: user_id={user_id}, trainee_id={trainee_id}, nutrition_plan_name={nutrition_plan_name}, nutrition_plan_description={nutrition_plan_description}, nutrition_plan_total_calories={nutrition_plan_total_calories}, meal_schedule={meal_schedule}")

        if user_id and username and email: 
            try:
                with connection.cursor() as cursor:
                    cursor.execute("""
                    INSERT INTO nutrition_plan (nutrition_plan_name, user_id, trainer_id, description, total_calories, meal_schedule)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """,[nutrition_plan_name, trainee_id, user_id, nutrition_plan_description, nutrition_plan_total_calories, meal_schedule])
                    print("hahahahahahahahahahahahahahahhahaha")
                    connection.commit()
                return Response({"message": "New Nutrition Plan Created"}, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                connection.rollback()
                return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                connection.rollback()
                return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeleteUserView(APIView):
    def delete(self, request, user_id):
        user_id = request.session.get('user_id')
        with connection.cursor() as cursor:
            try:
                # Execute the SQL query to delete the user
                cursor.execute("DELETE FROM userf WHERE user_id = %s", [user_id])
            except Exception as e:
                # Handle any database errors
                return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class DeleteTrainerView(APIView):
    def delete(self, request, trainer_id):
        with connection.cursor() as cursor:
            try:
                cursor.execute("DELETE FROM trainer WHERE trainer_id = %s", [trainer_id])
            except Exception as e:
                return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Trainer deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class DeleteTraineeView(APIView):
    def delete(self, request, user_id):
        with connection.cursor() as cursor:
            try:
                cursor.execute("DELETE FROM trainee WHERE user_id = %s", [user_id])
            except Exception as e:
                return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Trainee deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class ChangeUserDetailsView(APIView):
    def put(self, request, user_id):
        # Get the updated user details from the request data
        updated_details = request.data
        print(updated_details)
        # Ensure that user_id is provided in the URL or session
        if not user_id:
            return Response({"message": "User ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            try:
                # Execute the SQL query to update user details in trainee table
                cursor.execute("UPDATE trainee SET Age = %s, Date_of_Birth = %s, Gender = %s, Weight = %s, Height = %s, Past_Achievements = %s WHERE User_ID = %s",
                               [updated_details.get('age'), updated_details.get('date_of_birth'), 
                                updated_details.get('gender'), updated_details.get('weight'), updated_details.get('height'), updated_details.get('past_achievements'), user_id])
            except Exception as e:
                # Handle any database errors
                return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "User details updated successfully."}, status=status.HTTP_200_OK)
    
class UserWorkouts(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')
        print(f"User ID from session: {user_id}")

        if user_id:
            try:
                with connection.cursor() as cursor:
                    # Fetch the workout details including Trainer_Name
                    cursor.execute("""
                        SELECT wp.Routine_Name, wp.Exercises, wp.Duration, wp.Difficulty_Level, t.User_name, t.Trainer_ID
                        FROM workout_plan wp
                        JOIN trainer t ON wp.Trainer_ID = t.Trainer_ID
                        WHERE wp.User_ID = %s
                    """, [user_id])

                    workouts = cursor.fetchall()  # Fetch all rows
                    print('Workouts fetched:', workouts)

                    if not workouts:
                        return Response({"error": "Workout details not found."}, status=status.HTTP_404_NOT_FOUND)
                    
                    workout_details = []
                    for workout in workouts:
                        routine_name = workout[0]
                        exercises = workout[1]
                        duration = workout[2]
                        difficulty_level = workout[3]
                        trainer_name = workout[4]
                        trainer_id = workout[5]

                        # Fetch exercises for this routine
                        cursor.execute("""
                            SELECT Exercise_name
                            FROM Forms
                            WHERE Routine_name = %s AND User_ID = %s
                        """, [routine_name, user_id])
                        
                        exercises = cursor.fetchall()
                        exercise_names = [exercise[0] for exercise in exercises]
                        
                        workout_details.append({
                            'Routine_Name': routine_name,
                            'Exercises': exercise_names,
                            'Duration': duration,
                            'Difficulty_Level': difficulty_level,
                            'Trainer_Name': trainer_name,
                            'Trainer_ID': trainer_id,
                        })

                    print('Workout details with exercises:', workout_details)
                    return Response(workout_details, status=status.HTTP_200_OK)
                        
            except Exception as e:
                # Log the error
                print("Error fetching workout details:", str(e))
                return Response({"error": "An error occurred while fetching workout details."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        
class CreateWorkoutPlanView(APIView):

    '''
    def get(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            with connection.cursor() as cursor:
                # Fetch the user type (trainer or trainee)
                cursor.execute("SELECT * FROM Trainer WHERE Trainer_ID = %s", [user_id])
                is_trainer = cursor.fetchone()

                if is_trainer:
                    # If user is a trainer, fetch trainees
                    cursor.execute("SELECT User_ID FROM trains WHERE Trainer_ID = %s", [user_id])
                    trainees = cursor.fetchall()
                    return Response({"trainees": [trainee[0] for trainee in trainees]})
                else:
                    # If user is a trainee, fetch trainers
                    cursor.execute("SELECT Trainer_ID FROM trains WHERE User_ID = %s", [user_id])
                    trainers = cursor.fetchall()
                    return Response({"trainers": [trainer[0] for trainer in trainers]})

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    '''

    def post(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        trainer_id = request.data.get('trainer_id')
        routine_name = request.data.get('Routine_Name')
        
        duration = request.data.get('Duration')
        difficulty_level = request.data.get('Difficulty_Level')
        exercises = request.data.get('exerc')

        exercise_names = [exercise['Exercise_name'] for exercise in exercises]

        print(exercise_names)

        try:
            
            with connection.cursor() as cursor:
                print('AAAAAA')
                # Insert workout plan
                cursor.execute("""
                    INSERT INTO workout_plan (Routine_Name, Trainer_ID, User_ID, Exercises, Duration, Difficulty_Level)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, [routine_name, trainer_id, user_id, exercise_names, duration, difficulty_level])
                print('AAAAAA')
                # Insert exercises
                for exercise in exercise_names:
                    cursor.execute("""
                        INSERT INTO Forms (Exercise_name, Routine_name, Trainer_ID, User_ID, Completed)
                        VALUES (%s, %s, %s, %s, %s)
                    """, [exercise, routine_name, trainer_id, user_id, False])

            return Response({"success": "Workout plan created successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
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


        name = request.data.get('Exercise_name')
        exercise_type = request.data.get('type')
        description = request.data.get('Description')
        muscle_group = request.data.get('Muscle_Group_Targeted')
        equipment = request.data.get('Equipment')
        difficulty = request.data.get('Difficulty_Level')

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
            

class SpecificExercises(APIView):
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
        
class CompleteExercisesView(APIView):

    def post(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        completed_exercises = request.data.get('completedExercises', [])
        routine_name = request.data.get('routineName')
        trainer_id = request.data.get('trainerId')

        print(f"Received data: {request.data}")

        if not completed_exercises or not routine_name or not trainer_id:
            return Response({"error": "Incomplete data provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                for exercise in completed_exercises:
                    cursor.execute("""
                        UPDATE Forms
                        SET completed = True
                        WHERE Exercise_name = %s AND Routine_name = %s AND Trainer_ID = %s AND User_ID = %s
                    """, [exercise, routine_name, trainer_id, user_id])

            return Response({"success": "Exercises marked as completed."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class ChangeTrainerDetailsView(APIView):
    def put(self, request, trainer_id):
        # Get the updated trainer details from the request data
        updated_details = request.data
        print(updated_details)
        # Ensure that trainer_id is provided in the URL or session
        if not trainer_id:
            return Response({"message": "Trainer ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            try:
                # Execute the SQL query to update trainer details in trainer table
                cursor.execute("UPDATE trainer SET Specialization = %s, Telephone_Number = %s, Social_Media = %s WHERE Trainer_ID = %s",
                               [updated_details.get('specialization'), updated_details.get('telephone_number'),  updated_details.get('social_media'), trainer_id])
            except Exception as e:
                # Handle any database errors
                return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Trainer details updated successfully."}, status=status.HTTP_200_OK)
