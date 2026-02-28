import mysql.connector
from mysql.connector import Error

def create_connection(): 
    try: 
        connection = mysql.connector.connect(
            host='localhost',
            port = 3306,
            database='mydatabase',
            user='root',
            password=''
        )
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None
    return connection