from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.db import connection
from .utils import generate_user_id
from django.http import HttpResponse
import psycopg2
def runsql(sql_file, cur):
    # Read SQL file
    with open(sql_file, 'r') as file:
        sql_statement = file.read()
        cur.execute(sql_statement)
    print("SQL script executed successfully.")

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

        # Get form data
        user_name = request.POST.get('user_name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Execute raw SQL INSERT statement
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO \"user\" (user_id, user_name, password, email) VALUES (%s, %s, %s, %s)", [user_id, user_name, password, email])
            # Optionally, handle exceptions or validation

        return redirect('login')
    else:
        # Render registration form
        return render(request, 'register.html')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Execute raw SQL SELECT statement
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM \"user\" WHERE email = %s", [email])      #email has unique constraint in db
            user_row = cursor.fetchone()

        if user_row:
            stored_password = user_row[2]  # Assuming password is stored in the third column
            if password == stored_password:  # Validate password
                # User authenticated, redirect to home page
                return redirect('home')
            else:
                # Invalid password, handle accordingly
                pass
        else:
            # User not found, handle accordingly
            pass

    # Render login form
    return render(request, 'login.html')

def home(request):
    return render(request, 'home.html')
