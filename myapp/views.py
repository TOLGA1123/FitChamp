from django.shortcuts import render

import psycopg2
from django.db import connection
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, Http404
import uuid
from django.contrib import messages


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
    user_id = str(uuid.uuid4())[:11]  # Generate a UUID and truncate it to 11 characters
    return user_id

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

#trainer trainee different register views, first register trainee, go to trainer with button
def register(request):
    if request.method == 'POST':
        # Generate unique user_id 
        user_id = generate_user_id()

        # Get form data
        user_name = request.POST.get('user_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        if role == 'trainer':
            #insert new trainer into trainer table (change html fields of trainer/ same ones with user-fields are already filled)
            pass
        elif role == 'trainee':
            #insert new trainee into trainee table
            pass
        else:
            return HttpResponse('Invalid role selected.')
        #ALTER USER postgres WITH PASSWORD '1234';      #password = 1234 in pgadmin
        #insert user after so avoid the possibility of only user part filled and go back
        connection = psycopg2.connect(
            dbname="mydatabase",
            user="postgres",
            password="1234",
            host="localhost",
            port="5432"
        )
        # Execute raw SQL INSERT statement
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM userf WHERE Email = %s", [email])
            count = cursor.fetchone()[0]
            #User with the same email already exists
            if count > 0:
                messages.error(request, 'An account with this email already exists.')
                return redirect('register')
            cursor.execute("INSERT INTO userf (User_ID, User_name, Password, Email) VALUES (%s, %s, %s, %s)", [user_id, user_name, password, email])
            connection.commit()
            connection.close()
        return redirect('login')
    else:
        # Render registration form
        messages.error(request, 'Registration failed')
        return render(request, 'register.html')
def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        connection = psycopg2.connect(
            dbname="mydatabase",
            user="postgres",
            password="1234",
            host="localhost",
            port="5432"
        )
        # Execute raw SQL SELECT statement
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM userf WHERE email = %s", [email])
            user_row = cursor.fetchone()

        if user_row:
            stored_password = user_row[2]  # Assuming password is stored in the third column
            if password == stored_password:  # Validate password
                request.session['user_id'] = user_row[0]
                return redirect('home')
            else:
                messages.error(request, 'Invalid password. Please try again.')
        else:
            messages.error(request, 'User not found. Please try again.')
        connection.close()
    # Render login form
    return render(request, 'login.html')


#@login_required(login_url='/login/')
def home(request):
    if 'user_id' in request.session:
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
    else:
        return redirect('login')

#@login_required(login_url='/login/')
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





