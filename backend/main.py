from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional, Dict
import sqlite3
import math
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SQLITE_DB_PATH = "../sql/basketdb.sqlite3"

# JWT settings
SECRET_KEY = "csci4150"
ALGORITHM = "HS256"

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 password bearer for token handling
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class User(BaseModel):
    username: str
    password: str
    email:    str
    role:     str

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    username:        str
    role:            str
    hashed_password: str = ""

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

class GameCreate(BaseModel):
    game_date: datetime
    opponent: str
    location:      Optional[str] = None
    team_score:    int
    opponent_score:int
    attendance:    Optional[int] = None
    opponent_logo: Optional[str] = None

class Injury(BaseModel):
    injury_id:       int
    player_id:       int
    name:            str       
    injury_type:     str
    injury_date:     Optional[datetime]
    recovery_status: Optional[str]
    expected_return: Optional[datetime]
    created_at:      datetime

class InjuryCreate(BaseModel):
    player_id:       int
    injury_type:     str
    injury_date:     Optional[datetime] = None
    recovery_status: Optional[str]     = None
    expected_return: Optional[datetime] = None

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

class PlayerCreate(BaseModel):
    name: str
    jersey_number: Optional[int] = None
    position:       Optional[str] = None
    year:           Optional[str] = None
    age:            Optional[int] = None
    height:         Optional[float] = None
    weight:         Optional[float] = None
    points:         Optional[int] = 0
    bio:            Optional[str] = None
    image_url:      Optional[str] = None

def get_db_connection():
    try:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        print("Database connection established")  # Debugging line
        return conn
    except sqlite3.Error as e:
        print(f"Database connection error: {e}")
        raise HTTPException(500, detail="Database connection error")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Basketball API"}

# Function to get the current user from the JWT token
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        
        # If username or role is not found, raise credentials exception
        if username is None:
            raise credentials_exception
        
        return UserInDB(username=username, hashed_password="", role=role)
    
    except jwt.PyJWTError:
        raise credentials_exception

# JWT creation
def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Password hashing and verification
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Register User Endpoint
@app.post("/register/")
def register(user: User):
    try:
        print(f"Registering user: {user.username}")  # Debugging line
        
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE username = ?", (user.username,))
        existing_user = cursor.fetchone()
        print(f"Existing user: {existing_user}")  # Debugging line

        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")

        # Hash the password and insert the new user into the database
        hashed_password = hash_password(user.password)
        cursor.execute(
            "INSERT INTO users (username, email, hashed_password, role) VALUES (?, ?, ?, ?)",
            (user.username, user.email, hashed_password, user.role)
        )
        
        conn.commit()
        print(f"User {user.username} registered successfully")  # Debugging line
        conn.close()

        # After successful registration, generate and return a JWT token
        access_token = create_access_token(data={"sub": user.username, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer"}

    except sqlite3.Error as e:
        print(f"SQLite error during registration: {e}")
        raise HTTPException(status_code=500, detail="Database error during registration")

    except Exception as e:
        print(f"Unexpected error during registration: {e}")
        raise HTTPException(status_code=500, detail="User registration failed")

# Login Endpoint
@app.post("/login/")
def login(user: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (user.username,))
    db_user = cursor.fetchone()

    if not db_user:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify the password
    if not verify_password(user.password, db_user["hashed_password"]):
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create the JWT token
    access_token = create_access_token(data={"sub": user.username, "role": db_user["role"]})
    conn.close()
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route (example)
@app.get("/protected/")
def protected_route(current_user: UserInDB = Depends(get_current_user)):
    return {"message": f"Hello, {current_user.username}!"}

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

@app.post("/add-game/", response_model=Game)
def add_game(
    game_in: GameCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    if current_user.role != "coach":
        raise HTTPException(403, "Only coaches can add games.")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO games
              (game_date, opponent, location,
               team_score, opponent_score,
               attendance, opponent_logo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            game_in.game_date,
            game_in.opponent,
            game_in.location,
            game_in.team_score,
            game_in.opponent_score,
            game_in.attendance,
            game_in.opponent_logo,
        ))
        conn.commit()
        new_id = cur.lastrowid

        # Now fetch the inserted row
        cur.execute("SELECT * FROM games WHERE game_id = ?", (new_id,))
        row = cur.fetchone()
        conn.close()

        if not row:
            raise HTTPException(500, "Failed to fetch newly added game.")

        # Return it as a dict matching the Game model
        return dict(row)

    except sqlite3.Error as e:
        conn.close()
        raise HTTPException(500, f"Error adding game: {e}")
    
@app.delete("/delete-game/{game_id}")
def delete_game(
    game_id: int,
    current_user: UserInDB = Depends(get_current_user)
):
    if current_user.role != "coach":
        raise HTTPException(403, "Only coaches can delete games.")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT 1 FROM games WHERE game_id = ?", (game_id,))
        if not cur.fetchone():
            raise HTTPException(404, "Game not found.")

        cur.execute("DELETE FROM games WHERE game_id = ?", (game_id,))
        conn.commit()
        conn.close()
        return {"message": f"Game {game_id} deleted successfully."}

    except sqlite3.Error as e:
        conn.close()
        raise HTTPException(500, f"Error deleting game: {e}")
    
@app.post("/add-player/", response_model=PlayerExtended)
def add_player(
    player_in: PlayerCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    # only coaches may add
    if current_user.role != "coach":
        raise HTTPException(403, "Only coaches can add players.")

    conn = get_db_connection()
    cur = conn.cursor()

    # split name into first/last
    parts = player_in.name.strip().split(" ", 1)
    first_name = parts[0]
    last_name  = parts[1] if len(parts) > 1 else ""

    try:
        cur.execute("""
            INSERT INTO players
              (first_name, last_name,
               jersey_number, position, year,
               age, height, weight,
               points, bio, image_url)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        """, (
            first_name, last_name,
            player_in.jersey_number,
            player_in.position,
            player_in.year,
            player_in.age,
            player_in.height,
            player_in.weight,
            player_in.points,
            player_in.bio,
            player_in.image_url
        ))
        conn.commit()
        new_id = cur.lastrowid

        # now fetch just the columns PlayerExtended needs
        cur.execute("""
            SELECT 
              player_id,
              first_name || ' ' || last_name AS name,
              jersey_number,
              position,
              year,
              age,
              height,
              weight,
              points,
              points_per_game,
              total_rebounds    AS rebounds,
              rebounds_per_game,
              assists,
              fg_pct,
              games_played,
              created_at,
              image_url,
              bio
            FROM players
            WHERE player_id = ?
        """, (new_id,))
        row = cur.fetchone()
        conn.close()

        if not row:
            raise HTTPException(500, "Failed to fetch newly added player.")

        # row is a sqlite3.Row, so this dict comprehension works nicely
        return {
            "player_id":       row["player_id"],
            "name":            row["name"],
            "jersey_number":   row["jersey_number"],
            "position":        row["position"],
            "year":            row["year"],
            "age":             row["age"],
            "height":          row["height"],
            "weight":          row["weight"],
            "points":          row["points"],
            "points_per_game": row["points_per_game"],
            "rebounds":        row["rebounds"],
            "rebounds_per_game": row["rebounds_per_game"],
            "assists":         row["assists"],
            "fg_pct":          row["fg_pct"],
            "games_played":    row["games_played"],
            "created_at":      row["created_at"],
            "image_url":       row["image_url"],
            "bio":             row["bio"],
        }

    except sqlite3.Error as e:
        conn.close()
        raise HTTPException(500, f"Error adding player: {e}")

@app.delete("/delete-player/{player_id}")
def delete_player(player_id: int, current_user: UserInDB = Depends(get_current_user)):
    try:
        # Ensure the user is a coach before deleting a player
        if current_user.role != "coach":
            raise HTTPException(status_code=403, detail="Only coaches can delete players.")

        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if the player exists in the database
        cursor.execute("SELECT * FROM players WHERE player_id = ?", (player_id,))
        player = cursor.fetchone()
        if not player:
            conn.close()
            raise HTTPException(status_code=404, detail="Player not found.")

        # Delete the player from the database
        cursor.execute("DELETE FROM players WHERE player_id = ?", (player_id,))
        conn.commit()
        conn.close()

        return {"message": f"Player {player_id} deleted successfully."}

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Error deleting player: {e}")

@app.post("/add-injury/", response_model=Injury)
def add_injury(
    inj: InjuryCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    if current_user.role != "coach":
        raise HTTPException(403, "Only coaches can add injuries.")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Insert without touching created_at (it defaults)
        cur.execute("""
          INSERT INTO injuries (
            player_id, injury_type, injury_date,
            recovery_status, expected_return
          ) VALUES (?,?,?,?,?)
        """, (
          inj.player_id,
          inj.injury_type,
          inj.injury_date,
          inj.recovery_status,
          inj.expected_return
        ))
        conn.commit()
        new_id = cur.lastrowid

        # Fetch back the full row, including created_at and player's name
        cur.execute("""
          SELECT
            i.injury_id,
            i.player_id,
            p.first_name || ' ' || p.last_name AS name,
            i.injury_type,
            i.injury_date,
            i.recovery_status,
            i.expected_return,
            i.created_at
          FROM injuries i
          JOIN players p ON i.player_id = p.player_id
          WHERE i.injury_id = ?
        """, (new_id,))
        row = cur.fetchone()
    finally:
        conn.close()

    if not row:
        raise HTTPException(500, "Failed to fetch newly added injury.")

    # Return exactly the fields your Injury model needs
    return {
        "injury_id":       row["injury_id"],
        "player_id":       row["player_id"],
        "name":            row["name"],
        "injury_type":     row["injury_type"],
        "injury_date":     row["injury_date"],
        "recovery_status": row["recovery_status"],
        "expected_return": row["expected_return"],
        "created_at":      row["created_at"],
    }

@app.delete("/delete-injury/{injury_id}")
def delete_injury(
    injury_id: int,
    current_user: UserInDB = Depends(get_current_user)
):
    if current_user.role != "coach":
        raise HTTPException(403, "Only coaches can delete injuries.")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Verify it exists
        cur.execute("SELECT 1 FROM injuries WHERE injury_id = ?", (injury_id,))
        if not cur.fetchone():
            raise HTTPException(404, "Injury not found.")

        # Perform delete
        cur.execute("DELETE FROM injuries WHERE injury_id = ?", (injury_id,))
        conn.commit()
    finally:
        conn.close()

    return {"message": f"Injury {injury_id} deleted successfully."}