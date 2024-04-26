import psycopg2
conn = psycopg2.connect(dbname='postgres', user='postgres', host='localhost', password='1234', port='5432')
cur = conn.cursor()
