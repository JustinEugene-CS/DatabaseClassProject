from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from datetime import datetime

app = FastAPI()

SQLITE_DB_PATH = "basketdb.sqlite3"

# -------------------------------
# Pydantic Models
# -------------------------------

class FavoriteIn(BaseModel):
    item_type: str
    item_id: int

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
    position: Optional[str]
    jersey_number: Optional[int]
    weight: Optional[float]
    height: Optional[float]
    year: Optional[str]
    age: Optional[int]
    created_at: datetime
    performances: List[Performance] = []

class Game(BaseModel):
    game_id: int
    game_date: datetime
    opponent: str
    location: Optional[str]
    team_score: int
    opponent_score: int
    attendance: Optional[int]
    created_at: datetime

class Injury(BaseModel):
    injury_id: int
    player_id: int
    name: str
    injury_type: str
    injury_date: Optional[datetime]
    recovery_status: Optional[str]
    expected_return: Optional[datetime]
    created_at: datetime

# -------------------------------
# Database
# -------------------------------

def get_db_connection():
    try:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return None

# -------------------------------
# Endpoints
# -------------------------------

@app.get("/")
def read_root():
    return {"message": "Welcome to the Basketball API"}

@app.get("/random-player", response_model=PlayerExtended)
def get_random_player():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(500, "DB connection failed")
    cur = conn.cursor()
    cur.execute("SELECT *, first_name || ' ' || last_name AS name FROM players ORDER BY RANDOM() LIMIT 1")
    row = cur.fetchone()
    if row:
        player_id = row["player_id"]
        cur.execute("SELECT * FROM performances WHERE player_id = ?", (player_id,))
        performances = [dict(p) for p in cur.fetchall()]
        return {
            "player_id": row["player_id"],
            "name": row["name"],
            "position": row["position"],
            "jersey_number": row["jersey_number"],
            "weight": row["weight"],
            "height": row["height"],
            "year": row["year"],
            "age": row["age"],
            "created_at": row["created_at"],
            "performances": performances
        }
    else:
        raise HTTPException(404, "No player found")
    conn.close()

@app.get("/players", response_model=List[PlayerExtended])
def get_all_players():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(500, "DB connection failed")
    cur = conn.cursor()
    cur.execute("SELECT *, first_name || ' ' || last_name AS name FROM players ORDER BY first_name ASC, last_name ASC")
    players = cur.fetchall()
    results = []
    for row in players:
        player_id = row["player_id"]
        cur.execute("SELECT * FROM performances WHERE player_id = ?", (player_id,))
        performances = [dict(p) for p in cur.fetchall()]
        results.append({
            "player_id": row["player_id"],
            "name": row["name"],
            "position": row["position"],
            "jersey_number": row["jersey_number"],
            "weight": row["weight"],
            "height": row["height"],
            "year": row["year"],
            "age": row["age"],
            "created_at": row["created_at"],
            "performances": performances
        })
    conn.close()
    return results

@app.get("/random-game", response_model=Game)
def get_random_game():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(500, "DB connection failed")
    cur = conn.cursor()
    cur.execute("SELECT * FROM games ORDER BY RANDOM() LIMIT 1")
    row = cur.fetchone()
    conn.close()
    if row:
        return dict(row)
    raise HTTPException(404, "No game found")

@app.get("/games", response_model=List[Game])
def get_all_games():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(500, "DB connection failed")
    cur = conn.cursor()
    cur.execute("SELECT * FROM games ORDER BY game_date DESC")
    rows = cur.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/injuries", response_model=List[Injury])
def get_all_injuries():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(500, "DB connection failed")
    cur = conn.cursor()
    cur.execute("""
        SELECT i.*, p.first_name || ' ' || p.last_name AS name
        FROM injuries i
        JOIN players p ON i.player_id = p.player_id
        ORDER BY i.injury_date DESC
    """)
    rows = cur.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/favorites")
def add_favorite(fav: FavoriteIn):
    user_id = 1
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO favorites (user_id, item_type, item_id) VALUES (?, ?, ?)",
        (user_id, fav.item_type, fav.item_id)
    )
    conn.commit()
    fav_id = cur.lastrowid
    cur.close()
    conn.close()
    return {"favorite_id": fav_id}

@app.delete("/favorites/{favorite_id}")
def remove_favorite(favorite_id: int):
    user_id = 1
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM favorites WHERE favorite_id = ? AND user_id = ?",
        (favorite_id, user_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"deleted": True}

@app.get("/favorites", response_model=List[Dict])
def list_favorites(item_type: Optional[str] = None):
    user_id = 1
    conn = get_db_connection()
    cur = conn.cursor()
    if item_type:
        cur.execute(
            "SELECT * FROM favorites WHERE user_id = ? AND item_type = ? ORDER BY created_at DESC",
            (user_id, item_type)
        )
    else:
        cur.execute(
            "SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [dict(row) for row in rows]