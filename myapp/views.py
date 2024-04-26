from django.shortcuts import render

import psycopg2

from django.shortcuts import render
from django.http import HttpResponse

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



