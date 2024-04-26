from django.shortcuts import render

import psycopg2

from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.db import connection
from .utils import generate_user_id
from django.contrib import messages

def runsql(sql_file, cur):
    # Read SQL file
    with open(sql_file, 'r') as file:
        sql_statement = file.read()
        cur.execute(sql_statement)
    print("SQL script executed successfully.")
#ALTER USER postgres WITH PASSWORD '1120';      #password = 1120 in pgadmin
def my_view(request):
    conn = psycopg2.connect(dbname='mydatabase', user='postgres', host='localhost', password='1120', port='5432')
    cur = conn.cursor()
    runsql('myapp/schema.sql', cur)
    conn.commit()
    cur.close()
    conn.close()
    return HttpResponse("Hello, world!")

def register(request):
    if request.method == 'POST':
        # Generate unique user_id 
        user_id = generate_user_id()

        user_name = request.POST.get('user_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        connection = psycopg2.connect(
            dbname="mydatabase",
            user="postgres",
            password="1120",
            host="localhost",
            port="5432"
        )
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM \"user\" WHERE email = %s", [email])
            count = cursor.fetchone()[0]
            #User with the same email already exists
            if count > 0:
                messages.error(request, 'An account with this email already exists.')
                return redirect('register')
            cursor.execute("INSERT INTO \"user\" (user_id, user_name, password, email) VALUES (%s, %s, %s, %s)", [user_id, user_name, password, email])
            connection.commit()
        return redirect('login')
    else:
        return render(request, 'register.html')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM \"user\" WHERE email = %s", [email])      #email has unique constraint in db
            user_row = cursor.fetchone()

        if user_row:
            stored_password = user_row[2]
            if password == stored_password:
                request.session['user_id'] = user_row[0]
                return redirect('home')
            else:
                messages.error(request, 'Invalid password. Please try again.')
        else:
            messages.error(request, 'User not found. Please try again.')

    return render(request, 'login.html')

def home(request):
    if 'user_id' in request.session:
        return render(request, 'home.html')
    else:
        return redirect('login')

