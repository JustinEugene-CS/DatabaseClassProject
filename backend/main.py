# to start, run "source .venv/bin/activate"

# run server with "fastapi dev main.py"
# go to http://127.0.0.1:8000/items/5?q=somequery

# docs at http://127.0.0.1:8000/docs
# or at http://127.0.0.1:8000/redoc

from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime

app = FastAPI()

# Update these with your actual MySQL configuration.
MYSQL_HOST = "localhost"
MYSQL_USER = "your_mysql_username"
MYSQL_PASSWORD = "your_mysql_password"
MYSQL_DATABASE = "basketdb"  # Use the database name from your schema file

# -------------------------------
# Pydantic Models
# -------------------------------

class Performance(BaseModel):
    performance_id: int
    player_id: int
    game_id: int
    points: int
    rebounds: int
    assists: int
    turnovers: int
    blocks: int
    minutes_played: float
    created_at: datetime

class PlayerExtended(BaseModel):
    player_id: int
    name: str
    position: str = None
    jersey_number: int = None
    weight: float = None
    height: float = None
    year: str = None
    age: int = None
    created_at: datetime
    performances: List[Performance] = []

class Game(BaseModel):
    game_id: int
    game_date: datetime
    opponent: str
    location: str = None
    team_score: int
    opponent_score: int
    created_at: datetime

class Injury(BaseModel):
    injury_id: int
    player_id: int
    injury_type: str
    injury_date: datetime = None
    recovery_status: str = None
    expected_return: datetime = None
    created_at: datetime

# -------------------------------
# Helper: Database Connection
# -------------------------------
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

# -------------------------------
# Endpoints
# -------------------------------

@app.get("/")
def read_root():
    return {"message": "Welcome to the Basketball API"}

@app.get("/random-player", response_model=PlayerExtended)
def get_random_player():
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM players ORDER BY RAND() LIMIT 1"
    try:
        cursor.execute(query)
        player = cursor.fetchone()
        if player:
            # Concatenate first_name and last_name into one field
            full_name = f"{player['first_name']} {player['last_name']}"
            player_ext = {
                "player_id": player["player_id"],
                "name": full_name,
                "position": player.get("position"),
                "jersey_number": player.get("jersey_number"),
                "weight": float(player["weight"]) if player.get("weight") is not None else None,
                "height": float(player["height"]) if player.get("height") is not None else None,
                "year": player.get("year"),
                "age": player.get("age"),
                "created_at": player.get("created_at"),
                "performances": []  # To be filled below
            }

            # Fetch performances for this player
            cursor_performance = connection.cursor(dictionary=True)
            perf_query = "SELECT * FROM performances WHERE player_id = %s"
            cursor_performance.execute(perf_query, (player["player_id"],))
            performances = cursor_performance.fetchall()
            player_ext["performances"] = performances
            cursor_performance.close()
            return player_ext
        else:
            raise HTTPException(status_code=404, detail="No player found")
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")
    finally:
        cursor.close()
        connection.close()

@app.get("/players", response_model=List[PlayerExtended])
def get_all_players():
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = connection.cursor(dictionary=True)
    # Order players alphabetically by first_name and last_name
    query = "SELECT * FROM players ORDER BY first_name ASC, last_name ASC"
    players_list = []
    try:
        cursor.execute(query)
        players = cursor.fetchall()
        for player in players:
            full_name = f"{player['first_name']} {player['last_name']}"
            player_ext = {
                "player_id": player["player_id"],
                "name": full_name,
                "position": player.get("position"),
                "jersey_number": player.get("jersey_number"),
                "weight": float(player["weight"]) if player.get("weight") is not None else None,
                "height": float(player["height"]) if player.get("height") is not None else None,
                "year": player.get("year"),
                "age": player.get("age"),
                "created_at": player.get("created_at"),
                "performances": []
            }
            # For each player, fetch their performances
            cursor_perf = connection.cursor(dictionary=True)
            perf_query = "SELECT * FROM performances WHERE player_id = %s"
            cursor_perf.execute(perf_query, (player["player_id"],))
            performances = cursor_perf.fetchall()
            player_ext["performances"] = performances
            cursor_perf.close()
            players_list.append(player_ext)
        return players_list
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")
    finally:
        cursor.close()
        connection.close()

@app.get("/random-game", response_model=Game)
def get_random_game():
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM games ORDER BY RAND() LIMIT 1"
    try:
        cursor.execute(query)
        game = cursor.fetchone()
        if game:
            return game
        else:
            raise HTTPException(status_code=404, detail="No game found")
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")
    finally:
        cursor.close()
        connection.close()

@app.get("/games", response_model=List[Game])
def get_all_games():
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = connection.cursor(dictionary=True)
    # Order games by most recent game_date first
    query = "SELECT * FROM games ORDER BY game_date DESC"
    try:
        cursor.execute(query)
        games = cursor.fetchall()
        return games
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")
    finally:
        cursor.close()
        connection.close()

@app.get("/injuries", response_model=List[Injury])
def get_all_injuries():
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = connection.cursor(dictionary=True)
    # Order injuries by most recent injury_date first
    query = "SELECT * FROM injuries ORDER BY injury_date DESC"
    try:
        cursor.execute(query)
        injuries = cursor.fetchall()
        return injuries
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")
    finally:
        cursor.close()
        connection.close()