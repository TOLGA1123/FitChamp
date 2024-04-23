# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.db import connection
def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Execute raw SQL INSERT statement
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO auth_user (username, password) VALUES (%s, %s)", [username, password])
            # Optionally, handle exceptions or validation

        return redirect('login')
    else:
        # Render registration form
        return render(request, 'register.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Execute raw SQL SELECT statement
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM auth_user WHERE username = %s", [username])
            user_row = cursor.fetchone()

        if user_row:
            stored_password = user_row[1]  # Assuming password is stored in the second column
            if check_password(password, stored_password):  # Validate password
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