from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import sqlite3
import math
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SQLITE_DB_PATH = "../sql/basketdb.sqlite3"

class FavoriteIn(BaseModel):
    item_type: str
    item_id: int

class PlayerExtended(BaseModel):
    player_id: int
    name: str
    jersey_number: Optional[int]
    position: Optional[str]
    year: Optional[str]
    age: Optional[int]
    height: Optional[float]
    weight: Optional[float]
    points: Optional[int]
    points_per_game: Optional[float]
    rebounds: Optional[int]
    rebounds_per_game: Optional[float]
    assists: Optional[int]
    fg_pct: Optional[float]
    games_played: Optional[int]
    created_at: datetime

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

def get_db_connection():
    try:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return None

@app.get("/")
def read_root():
    return {"message": "Welcome to the Basketball API"}

@app.get("/debug-players")
def debug_players():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM players LIMIT 5")
    rows = cur.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/random-player", response_model=PlayerExtended)
def get_random_player():
    print("🔍 Hitting /random-player endpoint")
    conn = get_db_connection()
    if not conn:
        print("❌ DB connection failed")
        raise HTTPException(500, "DB connection failed")
    
    cur = conn.cursor()
    try:
        cur.execute("SELECT *, first_name || ' ' || last_name AS name FROM players ORDER BY RANDOM() LIMIT 1")
        row = cur.fetchone()
        if not row:
            print("❌ No player found in query")
            raise HTTPException(404, "No player found")
        
        print(f"✅ Found player: {row['name']} (ID: {row['player_id']})")

        return {
            "player_id": row["player_id"],
            "name": row["name"],
            "jersey_number": row["jersey_number"],
            "position": row["position"],
            "year": row["year"],
            "age": row["age"],
            "height": row["height"],
            "weight": row["weight"],
            "points": row["points"],
            "points_per_game": math.floor(row["points_per_game"]) if row["points_per_game"] is not None else None,
            "rebounds": row["total_rebounds"],
            "rebounds_per_game": math.floor(row["rebounds_per_game"]) if row["rebounds_per_game"] is not None else None,
            "assists": row["assists"],
            "fg_pct": row["fg_pct"],
            "games_played": row["games_played"],
            "created_at": row["created_at"]
        }
    except Exception as e:
        print("❌ Exception occurred in /random-player:", e)
        raise HTTPException(500, "Something went wrong")
    finally:
        conn.close()

@app.get("/players", response_model=List[PlayerExtended])
def get_all_players():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(500, "DB connection failed")
    cur = conn.cursor()
    cur.execute("SELECT *, first_name || ' ' || last_name AS name FROM players ORDER BY first_name, last_name")
    rows = cur.fetchall()
    conn.close()
    return [
    {
        "player_id": row["player_id"],
        "name": row["first_name"] + " " + row["last_name"],
        "jersey_number": row["jersey_number"],
        "position": row["position"],
        "year": row["year"],
        "age": row["age"],
        "height": row["height"],
        "weight": row["weight"],
        "points": row["points"],
        "points_per_game": math.floor(row["points_per_game"]) if row["points_per_game"] is not None else None,
        "rebounds": row["total_rebounds"],
        "rebounds_per_game": math.floor(row["rebounds_per_game"]) if row["rebounds_per_game"] is not None else None,
        "assists": row["assists"],
        "fg_pct": row["fg_pct"],
        "games_played": row["games_played"],
        "created_at": row["created_at"]
    }
    for row in rows
]

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