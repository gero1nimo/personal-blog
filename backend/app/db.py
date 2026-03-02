import psycopg

db_parameters = {
    "host": "localhost",
    "port": 5432,
    "dbname": "postgres",
    "user": "postgres",
    "password": "Ayzit56"
}

def db_connection():
    try:
        connection = psycopg.connect(**db_parameters)
        return connection
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None


def execute_query(query, params=None):
    connection = db_connection()
    if connection is None:
        return None

    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            connection.commit()
            return cursor.fetchall()
    except Exception as e:
        print(f"Error executing query: {e}")
        return None
    finally:
        connection.close()  
        
query = "SELECT * FROM projects"
results = execute_query(query)
if results is not None:
    for row in results:
        print(row)
        
