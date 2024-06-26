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
from datetime import datetime, time


# Create your views here.

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
        nutrition_plan_id = generate_unique_id()


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

                cursor.execute("""
                    INSERT INTO nutrition_plan (NutritionPlan_ID, User_ID, Total_Calories)
                    VALUES (%s, %s, %s)
                """, [nutrition_plan_id, user_id, 0]) 
                
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
            if user_row[4]:  # Check if profile picture data exists
                profile_picture_base64 = base64.b64encode(user_row[4]).decode('utf-8')
            else:
                profile_picture_base64 = None
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
                    request.session['profile_picture'] = profile_picture_base64
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
                    request.session['profile_picture'] = profile_picture_base64
                    request.session['type'] = 3
                    request.session.save()
                    print("LoginView - Session Key:", request.session.session_key)
                    print('Session data set:', request.session.items())  # Debug statement
                    return Response({3}, status=status.HTTP_200_OK)
                else:
                    # Invalid password
                    return Response({"error": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                if user_row[4]:  # Check if profile picture data exists
                    profile_picture_base64 = base64.b64encode(user_row[4]).decode('utf-8')
                else:
                    profile_picture_base64 = None
                stored_password = user_row[2]  # Assuming password is stored in the third column
                if password == stored_password:
                    # User authenticated
                    # User authenticated, store user details in session
                    request.session['user_id'] = user_row[0]
                    request.session['username'] = user_row[1]
                    request.session['email'] = user_row[3]
                    request.session['type'] = 1
                    request.session['profile_picture'] = profile_picture_base64
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
            profile_picture = request.session.get('profile_picture')
            print('profile picture:', profile_picture)
            print('Session data set:', request.session.items())  # Debug statement

            if user_id and username and email:
                try:
                    with connection.cursor() as cursor:
                        # Fetch the profile picture from the userf table
                        cursor.execute("""
                            SELECT profile_picture FROM userf WHERE user_id = %s
                        """, [user_id])
                        user_row = cursor.fetchone()

                    if not user_row:
                        return Response({"error": "User details not found."}, status=status.HTTP_404_NOT_FOUND)

                    profile_picture_base64 = base64.b64encode(user_row[0]).decode('utf-8') if user_row[0] else None

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
                            'profile_picture': profile_picture_base64,
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
            profile_picture = request.session.get('profile_picture')
            print('Session data set:', request.session.items())  # Debug statement

            if user_id and username and email:
                try:
                    print(user_id)
                    with connection.cursor() as cursor:
                        # Fetch the profile picture from the userf table
                        cursor.execute("""
                            SELECT profile_picture FROM userf WHERE user_id = %s
                        """, [user_id])
                        user_row = cursor.fetchone()

                    if not user_row:
                        return Response({"error": "User details not found."}, status=status.HTTP_404_NOT_FOUND)

                    profile_picture_base64 = base64.b64encode(user_row[0]).decode('utf-8') if user_row[0] else None
                    with connection.cursor() as cursor:
                        # Fetch the trainer details
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
                            'trainer': trainer,
                            'profile_picture': profile_picture_base64,
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
    def get(self, request):
        trainer_id = request.session.get('trainer_id')
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT trainee.user_id, trainee.user_name, trainee.password, trainee.age, trainee.date_of_birth, 
                       trainee.gender, trainee.weight, trainee.height, trainee.past_achievements, userf.profile_picture
                FROM trains
                INNER JOIN trainee ON trains.user_id = trainee.user_id
                INNER JOIN userf ON trainee.user_id = userf.user_id
                WHERE trains.trainer_id = %s
            """, [trainer_id])
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
                'past_achievements': trainee[8],
                'profile_picture': base64.b64encode(trainee[9]).decode('utf-8') if trainee[9] else None
            }
            for trainee in trainees
        ]

        return Response(trainee_list, status=status.HTTP_200_OK)

class NewTraineeView(APIView):
    def get(self, request):
        trainer_id = request.session.get('trainer_id')
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trains WHERE trainer_id = %s", [trainer_id])
            associated_trainees = cursor.fetchall()

        associated_trainee_ids = [row[0] for row in associated_trainees]

        if associated_trainee_ids:
            associated_trainee_ids_tuple = tuple(associated_trainee_ids)
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT t.*, u.profile_picture 
                    FROM trainee AS t 
                    INNER JOIN userf AS u ON t.user_id = u.user_id
                    WHERE t.user_id NOT IN %s
                """, [associated_trainee_ids_tuple])
                trainees = cursor.fetchall()
        else:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT t.*, u.profile_picture 
                    FROM trainee AS t 
                    INNER JOIN userf AS u ON t.user_id = u.user_id
                """)
                trainees = cursor.fetchall()

        trainees_data = [{
            'user_id': trainee[0],
            'user_name': trainee[1],
            'password': trainee[2],
            'age': trainee[3],
            'date_of_birth': trainee[4],
            'gender': trainee[5],
            'weight': trainee[6],
            'height': trainee[7],
            'past_achievements': trainee[8],
            'profile_picture': base64.b64encode(trainee[9]).decode('utf-8') if trainee[9] else None
        } for trainee in trainees]

        return Response(trainees_data, status=status.HTTP_200_OK)
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
            cursor.execute("""
                SELECT trainer.*, userf.profile_picture
                FROM trains 
                INNER JOIN trainer ON trains.trainer_id = trainer.trainer_id 
                INNER JOIN userf ON trainer.user_id = userf.user_id
                WHERE trains.user_id = %s
            """, [user_id])
            trainers = cursor.fetchall()
        
        trainer_list = [{
            'user_id': trainer[0],
            'trainer_id': trainer[1],
            'user_name': trainer[2],
            'password': trainer[3],
            'specialization': trainer[4],
            'telephone_number': trainer[5],
            'social_media': trainer[6],
            'profile_picture': base64.b64encode(trainer[7]).decode('utf-8') if trainer[7] else None
        } for trainer in trainers]
        
        return Response(trainer_list, status=status.HTTP_200_OK)
    
class NewTrainerView(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM trains WHERE user_id = %s", [user_id])
            associated_trainers = cursor.fetchall()
        associated_trainer_ids = [row[1] for row in associated_trainers]

        if associated_trainer_ids:
            associated_trainer_ids_tuple = tuple(associated_trainer_ids)
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT t.*, u.profile_picture 
                    FROM trainer AS t 
                    INNER JOIN userf AS u ON t.user_id = u.user_id 
                    WHERE t.trainer_id NOT IN %s
                """, [associated_trainer_ids_tuple])
                trainers = cursor.fetchall()
        else:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT t.*, u.profile_picture 
                    FROM trainer AS t 
                    INNER JOIN userf AS u ON t.user_id = u.user_id
                """)
                trainers = cursor.fetchall()

        trainers_data = [{
            'user_id': trainer[0],
            'trainer_id': trainer[1],
            'user_name': trainer[2],
            'password': trainer[3],
            'specialization': trainer[4],
            'telephone_number': trainer[5],
            'social_media': trainer[6],
            'profile_picture': base64.b64encode(trainer[7]).decode('utf-8') if trainer[7] else None
        } for trainer in trainers]

        return Response(trainers_data, status=status.HTTP_200_OK)
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
                    # Fetch the trainee details with profile picture using an inner join
                    cursor.execute("""
                        SELECT t.*, u.profile_picture
                        FROM trainee t
                        INNER JOIN userf u ON t.User_ID = u.User_ID
                        WHERE t.User_ID = %s
                    """, [str(trainee_Id)])
                    trainee = dictfetchone(cursor)
                    
                    if trainee:
                        profile_picture_data = trainee.pop('profile_picture')
                        if profile_picture_data is not None:
                            # Encode profile picture as base64 string
                            profile_picture_encoded = base64.b64encode(profile_picture_data).decode('utf-8')
                            trainee['profile_picture'] = profile_picture_encoded
                        
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
                    # Fetch the trainer details with profile picture using an inner join
                    cursor.execute("""
                        SELECT t.*, u.profile_picture
                        FROM trainer t
                        INNER JOIN userf u ON t.User_ID = u.User_ID
                        WHERE t.trainer_ID = %s
                    """, [str(trainer_Id)])
                    trainer = dictfetchone(cursor)
                    
                    if trainer:
                        profile_picture_data = trainer.pop('profile_picture')
                        if profile_picture_data is not None:
                            # Encode profile picture as base64 string
                            profile_picture_encoded = base64.b64encode(profile_picture_data).decode('utf-8')
                            trainer['profile_picture'] = profile_picture_encoded
                        
                        user_details = {
                            'user_id': user_id,
                            'username': username,
                            'email': email,
                            'trainer': trainer,
                        }
                        return Response(user_details, status=status.HTTP_200_OK)
                    else:
                        return Response({"error": "Trainer details not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)


     


        

class AllTrainersView(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT trainer.user_id, trainer.trainer_id, trainer.user_name, trainer.password, trainer.specialization, trainer.telephone_number, trainer.social_media, userf.profile_picture
                FROM trainer
                INNER JOIN userf ON trainer.user_id = userf.user_id
            """)
            trainers = cursor.fetchall()
        print(trainers)
        trainer_list = [{
            'user_id': trainer[0],
            'trainer_id': trainer[1],
            'user_name': trainer[2],
            'password': trainer[3],
            'specialization': trainer[4],
            'telephone_number': trainer[5],
            'social_media': trainer[6],
            'profile_picture': base64.b64encode(trainer[7]).decode('utf-8') if trainer[7] else None
        } for trainer in trainers]

        return Response(trainer_list, status=status.HTTP_200_OK)



class AllTraineesView(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT trainee.user_id, trainee.user_name, trainee.password, trainee.age, trainee.date_of_birth, trainee.gender, 
                       trainee.weight, trainee.height, trainee.past_achievements, userf.profile_picture
                FROM trainee
                INNER JOIN userf ON trainee.user_id = userf.user_id
            """)
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
            'profile_picture': base64.b64encode(trainee[9]).decode('utf-8') if trainee[9] else None
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

class CreateGroupSessionView(APIView):

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
    

def display_available_Group_sessions(trainer_id):
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
    

class GroupSessionView(APIView):
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
    
    
class JoinGroupSessionView(APIView):
    def post(self, request, session_id):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                # Check if the session exists and has available slots
                cursor.execute("""
                    SELECT gs.Group_Session_ID, gs.Max_Participants, COUNT(g.User_ID) as participants
                    FROM Group_Session gs
                    LEFT JOIN Group_Sessions g ON gs.Group_Session_ID = g.Group_Session_ID
                    WHERE gs.Group_Session_ID = %s
                    GROUP BY gs.Group_Session_ID, gs.Max_Participants
                """, [session_id])
                session = cursor.fetchone()

                if not session:
                    return Response({"error": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

                group_session_id, max_participants, participants = session

                if participants >= max_participants:
                    return Response({"error": "Session is full."}, status=status.HTTP_400_BAD_REQUEST)

                # Check if the user is already in the session
                cursor.execute("""
                    SELECT * FROM Group_Sessions
                    WHERE User_ID = %s AND Group_Session_ID = %s
                """, [user_id, group_session_id])
                if cursor.fetchone():
                    return Response({"error": "User already joined this session."}, status=status.HTTP_400_BAD_REQUEST)

                # Add user to the session
                cursor.execute("""
                    INSERT INTO Group_Sessions (User_ID, Group_Session_ID, Trainer_ID)
                    VALUES (%s, %s, (SELECT Trainer_ID FROM Group_Session WHERE Group_Session_ID = %s))
                """, [user_id, group_session_id, group_session_id])

                connection.commit()

            return Response({"message": "Joined group session successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            connection.rollback()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GroupSessionsView(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        print(user_id)
        try:
            with connection.cursor() as cursor:
                # Fetch joined group sessions
                cursor.execute("""
                    SELECT *
                    FROM Group_Session gs
                    INNER JOIN Group_Sessions g ON gs.Group_Session_ID = g.Group_Session_ID
                    WHERE g.User_ID = %s
                """, [user_id])
                joined_sessions = dictfetchall(cursor)
                print(user_id)

                # Fetch available group sessions
                cursor.execute("""
SELECT gs.Group_Session_ID, gs.Session_Name, gs.Location, gs.Starting_Time, gs.End_Time, gs.Type, gs.Max_Participants,
       COUNT(g.User_ID) as participants
FROM Group_Session gs
LEFT JOIN Group_Sessions g ON gs.Group_Session_ID = g.Group_Session_ID
GROUP BY gs.Group_Session_ID, gs.Session_Name, gs.Location, gs.Starting_Time, gs.End_Time, gs.Type, gs.Max_Participants
HAVING COUNT(g.User_ID) < gs.Max_Participants
AND gs.Group_Session_ID NOT IN (
    SELECT Group_Session_ID FROM Group_Sessions WHERE User_ID = %s
)

                """, [user_id])
                print(user_id)
                available_sessions = dictfetchall(cursor)

            return Response({
                "joined_sessions": joined_sessions,
                "available_sessions": available_sessions,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
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
        profile_picture = request.FILES.get('profile_picture')  # Retrieve the profile picture from request

        # Ensure that user_id is provided in the URL or session
        if not user_id:
            return Response({"message": "User ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            try:
                # Update the profile picture if provided
                if profile_picture:
                    # Convert the uploaded file into binary data
                    binary_data = profile_picture.read()
                    # Execute the SQL query to update profile picture in userf table
                    cursor.execute("UPDATE userf SET Profile_Picture = %s WHERE User_ID = %s",
                                   [binary_data, user_id])
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
                    #cursor.execute("""
                    #    SELECT wp.Routine_Name, wp.Exercises, wp.Duration, wp.Difficulty_Level, t.Trainer_ID
                    #    FROM workout_plan wp
                    #    JOIN trainer t ON wp.Trainer_ID = t.Trainer_ID
                    #    WHERE wp.trainer_ID = %s
                    #""", [user_id])

                    print("1")

                    cursor.execute("SELECT * FROM Forms WHERE user_id = %s AND completed = FALSE", [user_id])

                    print("2")

                    workouts = cursor.fetchall()  # Fetch all rows
                    print('Workouts fetched:', workouts)

                    print("3")

                    if not workouts:
                        return Response({"error": "Workout details not found."}, status=status.HTTP_404_NOT_FOUND)
                    
                    workout_details = []
                    for workout in workouts:
                        routine_name = workout[0]
                        trainer_id = workout[1]
                        '''exercises = workout[1]
                        duration = workout[2]
                        difficulty_level = workout[3]
                        '''

                        print("4")
                        # Fetch exercises for this routine
                        cursor.execute("""
                            SELECT *
                            FROM workout_plan
                            WHERE Routine_name = %s
                        """, [routine_name])
                        
                        exercises = cursor.fetchone()

                        print(exercises)
                        print("5")
                        exercise_names = exercises[2]
                        print("6")
                        #exercise_names = [exercise[0] for exercise in exercises]
                        #print(exercise_names)
                        duration = exercises[3]
                        difficulty_level = exercises[4]
                        print(exercise_names)
                        print(duration)
                        print(difficulty_level)

                        #workout_details = [{'Exercises': exercise[0], 'Duration': exercise[3], 'Difficulty_Level': exercise[4]} for exercise in exercises]
                        #print(workout_details)
                        
                        workout_details.append({
                            'Routine_Name': routine_name,
                            'Trainer_ID': trainer_id,
                            'Exercises': exercise_names,
                            'Duration': duration,
                            'Difficulty_Level': difficulty_level,

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
        trainer_id = request.session.get('trainer_id')
        if not trainer_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
        routine_name = request.data.get('Routine_Name')
        
        duration = request.data.get('Duration')
        difficulty_level = request.data.get('Difficulty_Level')
        exercises = request.data.get('exerc')

        exercise_names = [exercise['Exercise_name'] for exercise in exercises]

        print(exercise_names)

        try:
            
            with connection.cursor() as cursor:
                print(trainer_id)
                # Insert workout plan
                cursor.execute("""
                    INSERT INTO workout_plan (Routine_Name, Trainer_id, Exercises, Duration, Difficulty_Level)
                    VALUES (%s, %s, %s, %s, %s)
                """, [routine_name, trainer_id, exercise_names, duration, difficulty_level])
                print('AAAAAA')


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
                print("1")
                print(user_id)
                print(name)
                print(description)
                print(exercise_type)
                print(muscle_group)
                print(equipment)
                print(difficulty)
                cursor.execute("""
                    INSERT INTO Exercise (User_ID, Exercise_name, Description, Target_Audiance, Calories_Burned, Equipment, Difficulty_Level)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, [user_id, name, description, exercise_type, muscle_group, equipment, difficulty])
                connection.commit()
                print("2")

                return Response({"message": "New workout Plan Created"}, status=status.HTTP_200_OK)

        except IntegrityError as e:
                connection.rollback()
                return Response({"error": "Database error, possible duplicate entry: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
                connection.rollback()
                return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CompletedExercisesView(APIView):
    def get(self, request, routine_name):
        print("CompletedExercisesView - Session Key:", request.session.session_key)
        user_id = request.session.get('user_id')
        username = request.session.get('username')
        email = request.session.get('email')
        print('Session data set:', request.session.items()) 

        if user_id and username and email:
            try:    
                with connection.cursor() as cursor:
                    print("here")
                    cursor.execute("""
                        SELECT Exercise_name
                        FROM Forms
                        WHERE User_ID = %s AND Routine_name = %s AND Completed = TRUE
                    """, [user_id, routine_name])
                    completed_exercises = cursor.fetchall()

                if completed_exercises:
                    exercises_list = [{'Exercise_name': exercise[0]} for exercise in completed_exercises]
                    print('BBB: ', exercises_list)
                    return Response(exercises_list, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'No completed exercises found for this routine'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)
          

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
                    exercises_list = [{'user_id': exercise[0],'Exercise_name': exercise[1],'Target Audiance': exercise[2], 'Description': exercise[3], 'Calories Burned': exercise[4],'Equipment': exercise[5], 'Difficulty_Level': exercise[6]}for exercise in exercises]
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
        profile_picture = request.FILES.get('profile_picture')  # Retrieve the profile picture from request
        user_id = request.session.get('user_id')
        # Ensure that trainer_id is provided in the URL or session
        if not trainer_id:
            return Response({"message": "Trainer ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            try:
                # Update the profile picture if provided
                if profile_picture:
                    # Convert the uploaded file into binary data
                    binary_data = profile_picture.read()
                    # Execute the SQL query to update profile picture in userf table
                    cursor.execute("UPDATE userf SET Profile_Picture = %s WHERE User_ID = %s",
                                   [binary_data, user_id])
                # Execute the SQL query to update trainer details in trainer table
                cursor.execute("UPDATE trainer SET Specialization = %s, Telephone_Number = %s, Social_Media = %s WHERE Trainer_ID = %s",
                               [updated_details.get('specialization'), updated_details.get('telephone_number'),  updated_details.get('social_media'), trainer_id])
            except Exception as e:
                # Handle any database errors
                return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Trainer details updated successfully."}, status=status.HTTP_200_OK)
    
class AllWorkouts(APIView):

    def get(self, request):
        user_id = request.session.get('user_id')
        print(f"User ID from session: {user_id}")

        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                # Fetch all workout details including Trainer_Name
                cursor.execute("""
                    SELECT wp.Routine_Name, wp.Exercises, wp.Duration, wp.Difficulty_Level, t.User_name, t.Trainer_ID
                    FROM workout_plan wp
                    JOIN trainer t ON wp.Trainer_ID = t.Trainer_ID
                """)

                workouts = cursor.fetchall()  # Fetch all rows
                print('Workouts fetched:', workouts)

                if not workouts:
                    return Response({"error": "Workout details not found."}, status=status.HTTP_404_NOT_FOUND)

                # Fetch routines already in Forms table for the current user
                cursor.execute("""
                    SELECT DISTINCT Routine_name
                    FROM Forms
                    WHERE User_ID = %s
                """, [user_id])

                user_routines = cursor.fetchall()
                user_routine_names = [routine[0] for routine in user_routines]
                print('User routines:', user_routine_names)

                workout_details = []
                for workout in workouts:
                    routine_name = workout[0]
                    exercises = workout[1]
                    duration = workout[2]
                    difficulty_level = workout[3]
                    trainer_name = workout[4]
                    trainer_id = workout[5]

                    # Skip workouts that are already in the user's Forms table
                    if routine_name in user_routine_names:
                        continue

                    # Fetch exercises for this routine

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
        

class SelectWorkout(APIView):
    def post(self, request, routine_name):
        user_id = request.session.get('user_id')
        print(f"User ID from session: {user_id}")

        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM workout_plan WHERE routine_name = %s", [routine_name])
            plan = cursor.fetchone()

        trainer_id = plan[1]
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO forms (routine_name, trainer_id, user_id, completed) VALUES (%s, %s, %s, %s)", (routine_name, trainer_id, user_id, False))
        
        return Response({"success": "Workout plan selected."}, status=status.HTTP_200_OK)


class DeleteWorkoutView(APIView):
    
    def post(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        routine_name = request.data.get('routineName')
        trainer_id = request.data.get('trainerId')

        print(f"Received data: {request.data}")

        if not routine_name or not trainer_id:
            return Response({"error": "Incomplete data provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Step 1: Delete entries from the Forms table related to the specified Routine_Name
                cursor.execute("""
                    DELETE FROM Forms
                    WHERE Routine_name = %s AND Trainer_ID = %s AND User_ID = %s
                """, [routine_name, trainer_id, user_id])

                # Step 2: Find exercises related to the routine and check if they need to be deleted
                cursor.execute("""
                    SELECT Exercise_name
                    FROM Forms
                    WHERE Routine_name = %s
                """, [routine_name])
                exercises = cursor.fetchall()

                # Step 3: Delete the routine from the workout_plan table
                cursor.execute("""
                    DELETE FROM workout_plan
                    WHERE Routine_Name = %s AND Trainer_ID = %s AND User_ID = %s
                """, [routine_name, trainer_id, user_id])

            return Response({"success": "Workout and associated entries deleted successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class TrainerScheduleSessionView(APIView):
    def post(self, request, user_id):
        trainer_id = request.session.get('trainer_id')
        if not trainer_id:
            return Response({'error': 'Trainer not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        session_id = generate_unique_id()
        session_date = request.data.get('session_date')
        session_time = request.data.get('session_time')
        location = request.data.get('location')
        description = request.data.get('description')

        print(user_id,trainer_id, session_id, session_date, session_time, location, description)

        if not self.is_trainer_available(trainer_id, session_date, session_time):
            return Response({'error': 'Trainer is not available'}, status=status.HTTP_400_BAD_REQUEST)
        print("Yo")
        
        # Insert session details into the database
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO individual_session (Trainer_ID, User_ID, Session_ID, Session_Date, Session_Time, Location, Description)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, [trainer_id, user_id, session_id, session_date, session_time, location, description])
                print("a")
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Session scheduled successfully'}, status=status.HTTP_201_CREATED)
    
    def is_trainer_available(self, trainer_id, session_date_str, session_time_str):
        # Parse the input strings to datetime objects
        session_date = datetime.strptime(session_date_str, '%Y-%m-%d').date()

        # Handle time string that might not include seconds
        try:
            session_time = datetime.strptime(session_time_str, '%H:%M:%S').time()
        except ValueError:
            session_time = datetime.strptime(session_time_str, '%H:%M').time()

        # Format the session_date as a string to match the database format
        session_date_formatted = session_date.strftime('%Y-%m-%d')

        # Calculate the start and end times for the one-day range
        start_time_str = '00:00:00'
        end_time_str = '23:59:59'
        
        # Query to check if trainer has any conflicting sessions within the one-day range
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*) 
                FROM individual_session 
                WHERE Trainer_ID = %s 
                AND Session_Date = %s 
                AND Session_Time BETWEEN %s AND %s
                """, [trainer_id, session_date_formatted, start_time_str, end_time_str])
            session_count = cursor.fetchone()[0]
        
        print('session_count = ', session_count)
        return session_count == 0



class TraineeSessionView(APIView):
    def get(self, request, trainee_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT session_id, session_date, session_time, location, description
                    FROM individual_session
                    WHERE user_id = %s
                """, [trainee_id])
                sessions = cursor.fetchall()
            
            serialized_sessions = []
            for session in sessions:
                serialized_session = {
                    'session_id': session[0],
                    'session_date': session[1],
                    'session_time': session[2],
                    'location': session[3],
                    'description': session[4],
                    # Add more fields as needed
                }
                serialized_sessions.append(serialized_session)
            
            return Response(serialized_sessions, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StartTimeView(APIView):
    def post(self, request, start_time, routine_name):
        user_id = request.session.get('user_id')
        try:
            with connection.cursor() as cursor:
                cursor.execute("UPDATE forms SET start_time = %s WHERE routine_name = %s AND User_id = %s", [start_time, routine_name, user_id])

            return Response({"success": "start time added"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EndTimeView(APIView):
    def post(self, request, end_time, routine_name):
        user_id = request.session.get('user_id')
        print("printthishit")
        with connection.cursor() as cursor:
            cursor.execute("UPDATE forms SET end_time = %s, completed = %s WHERE routine_name = %s AND User_id = %s", [end_time, True, routine_name, user_id])

        return Response({"success": "end time added"}, status=status.HTTP_200_OK)
    
class CompletedUserWorkoutsView(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')
        print(f"User ID from session: {user_id}")

        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT *
                    FROM forms
                    WHERE Trainer_ID IN (
                        SELECT Trainer_ID FROM forms WHERE User_ID = %s
                    ) AND Completed = TRUE
                """, [user_id])

                workouts = cursor.fetchall()
                if not workouts:
                    return Response({"error": "No completed workout plans found for user."}, status=status.HTTP_404_NOT_FOUND)

                workout_details = [
                    {
                        'Routine_Name': workout[0],
                        'Trainer_ID': workout[1],
                        'Exercises': workout[2],
                        'Duration': workout[3],
                        'Difficulty_Level': workout[4],
                        'Completed': workout[5]
                    }
                    for workout in workouts
                ]

                return Response(workout_details, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error fetching completed workout plans: {str(e)}")
            return Response({"error": "An error occurred while fetching completed workout plans."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



    
class DeleteWorkoutView(APIView):

    def post(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"error": "User not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        routine_name = request.data.get('routineName')
        trainer_id = request.data.get('trainerId')

        print(f"Received data: {request.data}")

        if not routine_name or not trainer_id:
            return Response({"error": "Incomplete data provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Step 1: Delete entries from the Forms table related to the specified Routine_Name
                cursor.execute("""
                    DELETE FROM Forms
                    WHERE Routine_name = %s AND Trainer_ID = %s AND User_ID = %s
                """, [routine_name, trainer_id, user_id])

                # Step 2: Find exercises related to the routine and check if they need to be deleted
                cursor.execute("""
                    SELECT Exercise_name
                    FROM Forms
                    WHERE Routine_name = %s
                """, [routine_name])
                exercises = cursor.fetchall()

                # Step 3: Delete the routine from the workout_plan table
                cursor.execute("""
                    DELETE FROM workout_plan
                    WHERE Routine_Name = %s AND Trainer_ID = %s AND User_ID = %s
                """, [routine_name, trainer_id, user_id])

            return Response({"success": "Workout and associated entries deleted successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)