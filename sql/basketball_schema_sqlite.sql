
-- SQLite version of the Basketball Project Schema

DROP TABLE IF EXISTS injuries;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS favorites;

CREATE TABLE players (
  player_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT,
  jersey_number INTEGER,
  year TEXT,
  age INTEGER,
  height REAL,
  weight REAL,
  games_played INTEGER DEFAULT 0,
  games_started INTEGER DEFAULT 0,
  minutes INTEGER DEFAULT 0,
  minutes_per_game REAL DEFAULT 0.0,
  fg_made INTEGER DEFAULT 0,
  fg_attempts INTEGER DEFAULT 0,
  fg_pct REAL DEFAULT 0.000,
  three_made INTEGER DEFAULT 0,
  three_attempts INTEGER DEFAULT 0,
  three_pct REAL DEFAULT 0.000,
  ft_made INTEGER DEFAULT 0,
  ft_attempts INTEGER DEFAULT 0,
  ft_pct REAL DEFAULT 0.000,
  off_rebounds INTEGER DEFAULT 0,
  def_rebounds INTEGER DEFAULT 0,
  total_rebounds INTEGER DEFAULT 0,
  rebounds_per_game REAL DEFAULT 0.0,
  personal_fouls INTEGER DEFAULT 0,
  dq INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  points_per_game REAL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
  game_id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_date DATE NOT NULL,
  opponent TEXT NOT NULL,
  location TEXT,
  team_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  attendance INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE injuries (
  injury_id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  injury_type TEXT NOT NULL,
  injury_date DATE,
  recovery_status TEXT,
  expected_return DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  email TEXT UNIQUE,
  hashed_password TEXT,
  role TEXT
);

CREATE TABLE favorites (
  favorite_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  item_type TEXT NOT NULL, -- 'player' or 'game'
  item_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
