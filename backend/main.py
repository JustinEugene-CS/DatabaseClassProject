# to start, run "source .venv/bin/activate"

# run server with "fastapi dev main.py"
# go to http://127.0.0.1:8000/items/5?q=somequery

# docs at http://127.0.0.1:8000/docs
# or at http://127.0.0.1:8000/redoc

from typing import Union, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error

app = FastAPI()

# Database connection settings – update these with your actual values.
MYSQL_HOST = "localhost"
MYSQL_USER = "your_mysql_username"
MYSQL_PASSWORD = "your_mysql_password"
MYSQL_DATABASE = "your_database_name"

# Pydantic model representing the Athlete
class Athlete(BaseModel):
    id: int
    name: str
    statistics: dict  = {}  # assuming your JSON columns are stored as JSON text
    injuries: dict  = {}

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.get("/")
def read_root():
    return {"message": "Welcome to the Athlete API"}

@app.get("/athletes", response_model=List[Athlete])
def get_athletes():
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM athletes"
    try:
        cursor.execute(query)
        athletes = cursor.fetchall()
        # If your columns 'statistics' and 'injuries' are stored as JSON strings,
        # you might want to convert them from string to dict.
        for athlete in athletes:
            if isinstance(athlete.get("statistics"), str):
                try:
                    athlete["statistics"] = json.loads(athlete["statistics"])
                except Exception:
                    athlete["statistics"] = {}
            if isinstance(athlete.get("injuries"), str):
                try:
                    athlete["injuries"] = json.loads(athlete["injuries"])
                except Exception:
                    athlete["injuries"] = {}
        return athletes
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error querying the database: {e}")
    finally:
        cursor.close()
        connection.close()

@app.get("/athletes/{athlete_id}", response_model=Athlete)
def get_athlete(athlete_id: int):
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM athletes WHERE id = %s"
    try:
        cursor.execute(query, (athlete_id,))
        athlete = cursor.fetchone()
        if athlete is None:
            raise HTTPException(status_code=404, detail="Athlete not found")
        # Convert JSON-string columns to dict if needed
        import json
        if isinstance(athlete.get("statistics"), str):
            try:
                athlete["statistics"] = json.loads(athlete["statistics"])
            except Exception:
                athlete["statistics"] = {}
        if isinstance(athlete.get("injuries"), str):
            try:
                athlete["injuries"] = json.loads(athlete["injuries"])
            except Exception:
                athlete["injuries"] = {}
        return athlete
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error querying the database: {e}")
    finally:
        cursor.close()
        connection.close()