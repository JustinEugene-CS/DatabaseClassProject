# to start, run "source .venv/bin/activate"
# run server with "fastapi dev main.py"
# docs at http://127.0.0.1:8000/docs or /redoc

from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
from datetime import datetime

app = FastAPI()

# MySQL configuration (update with your credentials)
MYSQL_HOST = "localhost"
MYSQL_USER = "your_mysql_username"
MYSQL_PASSWORD = "your_mysql_password"
MYSQL_DATABASE = "basketdb"

# -------------------------------
# Pydantic Models
# -------------------------------

class FavoriteIn(BaseModel):
    item_type: str  # 'player' or 'game'
    item_id: int

class Player(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    position: Optional[str] = None
    jersey_number: Optional[int] = None
    year: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    games_played: int
    games_started: int
    minutes: int
    minutes_per_game: float
    fg_made: int
    fg_attempts: int
    fg_pct: float
    three_made: int
    three_attempts: int
    three_pct: float
    ft_made: int
    ft_attempts: int
    ft_pct: float
    off_rebounds: int
    def_rebounds: int
    total_rebounds: int
    rebounds_per_game: float
    personal_fouls: int
    dq: int
    assists: int
    turnovers: int
    blocks: int
    steals: int
    points: int
    points_per_game: float
    created_at: datetime

class Game(BaseModel):
    game_id: int
    game_date: datetime
    opponent: str
    location: Optional[str] = None
    team_score: int
    opponent_score: int
    attendance: Optional[int] = None
    created_at: datetime

class Injury(BaseModel):
    injury_id: int
    player_id: int
    injury_type: str
    injury_date: Optional[datetime] = None
    recovery_status: Optional[str] = None
    expected_return: Optional[datetime] = None
    created_at: datetime

# -------------------------------
# Database Connection Helper
# -------------------------------
def get_db_connection():
    try:
        return mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE
        )
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# -------------------------------
# API Endpoints
# -------------------------------

@app.get("/", summary="Root endpoint")
def read_root():
    return {"message": "Welcome to the Basketball API"}

@app.get("/random-player", response_model=Player)
def get_random_player():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM players ORDER BY RAND() LIMIT 1")
        player = cursor.fetchone()
        if not player:
            raise HTTPException(status_code=404, detail="No player found")
        return player
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/players", response_model=List[Player])
def get_all_players():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM players ORDER BY first_name, last_name")
        return cursor.fetchall()
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/random-game", response_model=Game)
def get_random_game():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM games ORDER BY RAND() LIMIT 1")
        game = cursor.fetchone()
        if not game:
            raise HTTPException(status_code=404, detail="No game found")
        return game
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/games", response_model=List[Game])
def get_all_games():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM games ORDER BY game_date DESC")
        return cursor.fetchall()
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/injuries", response_model=List[Injury])
def get_all_injuries():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM injuries ORDER BY injury_date DESC")
        return cursor.fetchall()
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# -------------------------------
# Favorites Endpoints
# -------------------------------

@app.post("/favorites")
def add_favorite(fav: FavoriteIn):
    user_id = 1  # placeholder until auth is implemented
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO favorites (user_id, item_type, item_id) VALUES (%s, %s, %s)",
        (user_id, fav.item_type, fav.item_id)
    )
    conn.commit()
    fav_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"favorite_id": fav_id}

@app.delete("/favorites/{favorite_id}")
def remove_favorite(favorite_id: int):
    user_id = 1
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM favorites WHERE favorite_id = %s AND user_id = %s",
        (favorite_id, user_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"deleted": True}

@app.get("/favorites", response_model=List[Dict])
def list_favorites(item_type: Optional[str] = None):
    user_id = 1
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    if item_type:
        cursor.execute(
            "SELECT * FROM favorites WHERE user_id = %s AND item_type = %s ORDER BY created_at DESC",
            (user_id, item_type)
        )
    else:
        cursor.execute(
            "SELECT * FROM favorites WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results