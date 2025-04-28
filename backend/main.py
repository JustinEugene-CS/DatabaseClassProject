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
    player_id: int  # Player ID for the favorite
    user_id: int    # User ID who favorited the player

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
    image_url: Optional[str] 
    bio: Optional[str]

class Game(BaseModel):
    game_id: int
    game_date: datetime
    opponent: str
    location: Optional[str]
    team_score: int
    opponent_score: int
    attendance: Optional[int]
    opponent_logo: Optional[str]
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

class PlayerGame(BaseModel):
    game_id: int
    game_date: datetime
    opponent: str
    team_score: int
    opponent_score: int
    attendance: Optional[int]
    opponent_logo: Optional[str]
    minutes_played: int  # MIN from player_game table
    games_started: int   # GS from player_game table

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
        

        if row:
            return {
                "player_id": row["player_id"],
                "name": row["name"],
                "jersey_number": row["jersey_number"] if row["jersey_number"] is not None else 0,
                "position": row["position"] if row["position"] is not None else "N/A",
                "year": row["year"] if row["year"] is not None else "N/A",
                "age": row["age"] if row["age"] is not None else 0,
                "height": row["height"] if row["height"] is not None else 0.0,
                "weight": row["weight"] if row["weight"] is not None else 0.0,
                "points": row["points"] if row["points"] is not None else 0,
                "points_per_game": math.floor(row["points_per_game"]) if row["points_per_game"] is not None else 0.0,
                "rebounds": row["total_rebounds"] if row["total_rebounds"] is not None else 0,
                "rebounds_per_game": math.floor(row["rebounds_per_game"]) if row["rebounds_per_game"] is not None else 0.0,
                "assists": row["assists"] if row["assists"] is not None else 0,
                "fg_pct": row["fg_pct"] if row["fg_pct"] is not None else 0.0,
                "games_played": row["games_played"] if row["games_played"] is not None else 0,
                "games_started": row["games_started"] if row["games_started"] is not None else 0,  # Ensure this field is included
                "minutes": row["minutes"] if row["minutes"] is not None else 0,  # Ensure this field is included
                "minutes_per_game": row["minutes_per_game"] if row["minutes_per_game"] is not None else 0.0,  # Ensure this field is included
                "fg_made": row["fg_made"] if row["fg_made"] is not None else 0,  # Ensure this field is included
                "three_made": row["three_made"] if row["three_made"] is not None else 0,
                "ft_made": row["ft_made"] if row["ft_made"] is not None else 0,
                "off_rebounds": row["off_rebounds"] if row["off_rebounds"] is not None else 0,
                "def_rebounds": row["def_rebounds"] if row["def_rebounds"] is not None else 0,
                "total_rebounds": row["total_rebounds"] if row["total_rebounds"] is not None else 0,
                "personal_fouls": row["personal_fouls"] if row["personal_fouls"] is not None else 0,
                "turnovers": row["turnovers"] if row["turnovers"] is not None else 0,
                "blocks": row["blocks"] if row["blocks"] is not None else 0,
                "steals": row["steals"] if row["steals"] is not None else 0,
                "bio": row["bio"] if row["bio"] else "No bio available",
                "created_at": row["created_at"],
                "image_url": row["image_url"] if row["image_url"] else None,
            }
        else:
            print("❌ No player found in query")
            raise HTTPException(404, "No player found")
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
                "name": row["name"],
                "jersey_number": row["jersey_number"] if row["jersey_number"] is not None else 0,
                "position": row["position"] if row["position"] is not None else "N/A",
                "year": row["year"] if row["year"] is not None else "N/A",
                "age": row["age"] if row["age"] is not None else 0,
                "height": row["height"] if row["height"] is not None else 0.0,
                "weight": row["weight"] if row["weight"] is not None else 0.0,
                "points": row["points"] if row["points"] is not None else 0,
                "points_per_game": math.floor(row["points_per_game"]) if row["points_per_game"] is not None else 0.0,
                "rebounds": row["total_rebounds"] if row["total_rebounds"] is not None else 0,
                "rebounds_per_game": math.floor(row["rebounds_per_game"]) if row["rebounds_per_game"] is not None else 0.0,
                "assists": row["assists"] if row["assists"] is not None else 0,
                "fg_pct": row["fg_pct"] if row["fg_pct"] is not None else 0.0,
                "games_played": row["games_played"] if row["games_played"] is not None else 0,
                "games_started": row["games_started"] if row["games_started"] is not None else 0,  # Ensure this field is included
                "minutes": row["minutes"] if row["minutes"] is not None else 0,  # Ensure this field is included
                "minutes_per_game": row["minutes_per_game"] if row["minutes_per_game"] is not None else 0.0,  # Ensure this field is included
                "fg_made": row["fg_made"] if row["fg_made"] is not None else 0,  # Ensure this field is included
                "three_made": row["three_made"] if row["three_made"] is not None else 0,
                "ft_made": row["ft_made"] if row["ft_made"] is not None else 0,
                "off_rebounds": row["off_rebounds"] if row["off_rebounds"] is not None else 0,
                "def_rebounds": row["def_rebounds"] if row["def_rebounds"] is not None else 0,
                "total_rebounds": row["total_rebounds"] if row["total_rebounds"] is not None else 0,
                "personal_fouls": row["personal_fouls"] if row["personal_fouls"] is not None else 0,
                "turnovers": row["turnovers"] if row["turnovers"] is not None else 0,
                "blocks": row["blocks"] if row["blocks"] is not None else 0,
                "steals": row["steals"] if row["steals"] is not None else 0,
                "bio": row["bio"] if row["bio"] else "No bio available",
                "created_at": row["created_at"],
                "image_url": row["image_url"] if row["image_url"] else None,
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
    return [
        {
            "game_id": row["game_id"],
            "game_date": row["game_date"],
            "opponent": row["opponent"],
            "location": row["location"],
            "team_score": row["team_score"],
            "opponent_score": row["opponent_score"],
            "attendance": row["attendance"],
            "opponent_logo": row["opponent_logo"],  # Send opponent_logo for each game
            "created_at": row["created_at"]
        }
        for row in rows
    ]

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
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Insert the favorite into the favorites table
        cur.execute(
            "INSERT INTO favorites (user_id, player_id) VALUES (?, ?)",
            (fav.user_id, fav.player_id)
        )
        conn.commit()  # Commit the transaction

        # Get the last inserted favorite_id (useful if you need to return it or use it)
        favorite_id = cur.lastrowid
        return {"favorite_id": favorite_id}  # Return the inserted favorite_id
    except Exception as e:
        print(f"❌ Error adding favorite: {e}")
        raise HTTPException(500, "Error adding favorite")
    finally:
        conn.close()

@app.delete("/favorites")
def remove_favorite(fav: FavoriteIn):
    user_id = fav.user_id  # Assuming the user_id is passed as part of the request
    player_id = fav.player_id

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Delete the favorite entry where the player matches and the user_id is correct
        cur.execute(
            "DELETE FROM favorites WHERE player_id = ? AND user_id = ?",
            (player_id, user_id)
        )
        conn.commit()
        
        if cur.rowcount == 0:
            raise HTTPException(404, "Favorite not found")
        
        return {"deleted": True}
    
    except Exception as e:
        print(f"Error removing favorite: {e}")
        raise HTTPException(500, "Error removing favorite")
    
    finally:
        cur.close()
        conn.close()

@app.get("/favorites", response_model=List[Dict])
def list_favorites():
    user_id = 1  # Simulated user_id for now
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Fetch favorites for this user
        cur.execute(
            "SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        )
        rows = cur.fetchall()
        conn.close()

        return [dict(row) for row in rows]

    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Error fetching favorites: {e}")

# Function to get a DB connection (not provided in the code snippet)
def get_db_connection():
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/player-games/{player_id}")
def get_player_games(player_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(500, "DB connection failed")

    try:
        # Query player_game table for games played by the player
        cur = conn.cursor()
        cur.execute("""
            SELECT pg.game_id, g.opponent_logo, pg.MIN as minutes_played, g.team_score, g.opponent_score
            FROM player_game pg
            JOIN games g ON pg.game_id = g.game_id
            WHERE pg.player_id = ?
        """, (player_id,))
        
        rows = cur.fetchall()
        games = [
            {
                "game_id": row["game_id"],
                "opponent_logo": row["opponent_logo"],
                "minutes_played": row["minutes_played"],
                "team_score": row["team_score"],
                "opponent_score": row["opponent_score"]
            }
            for row in rows
        ]
        
        return games
    except Exception as e:
        print(f"❌ Error fetching player games: {e}")
        raise HTTPException(500, "Error fetching player games")
    finally:
        conn.close()