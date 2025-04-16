-- ====================================================
-- Queries for Table: players
-- ====================================================

-- Get all players
SELECT * FROM players;

-- Get a player by ID
SELECT * FROM players WHERE player_id = ?;

-- Insert a new player
INSERT INTO players (first_name, last_name, position, jersey_number, weight, height, year, age)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- Update a player's information
UPDATE players
SET first_name = ?, last_name = ?, position = ?, jersey_number = ?, weight = ?, height = ?, year = ?, age = ?
WHERE player_id = ?;

-- Delete a player
DELETE FROM players WHERE player_id = ?;

-- ====================================================
-- Queries for Table: games
-- ====================================================

-- Get all games
SELECT * FROM games;

-- Get a game by ID
SELECT * FROM games WHERE game_id = ?;

-- Insert a new game
INSERT INTO games (game_date, opponent, location, team_score, opponent_score)
VALUES (?, ?, ?, ?, ?);

-- Update a game's information
UPDATE games
SET game_date = ?, opponent = ?, location = ?, team_score = ?, opponent_score = ?
WHERE game_id = ?;

-- Delete a game
DELETE FROM games WHERE game_id = ?;

-- ====================================================
-- Queries for Table: injuries
-- ====================================================

-- Get all injuries
SELECT * FROM injuries;

-- Get injuries for a specific player
SELECT * FROM injuries WHERE player_id = ?;

-- Insert a new injury record
INSERT INTO injuries (player_id, injury_type, injury_date, recovery_status, expected_return)
VALUES (?, ?, ?, ?, ?);

-- Update an injury record
UPDATE injuries
SET injury_type = ?, injury_date = ?, recovery_status = ?, expected_return = ?
WHERE injury_id = ?;

-- Delete an injury record
DELETE FROM injuries WHERE injury_id = ?;

-- ====================================================
-- Queries for Table: performances
-- ====================================================

-- Get all performances
SELECT * FROM performances;

-- Get performances for a specific player
SELECT * FROM performances WHERE player_id = ?;

-- Get performances for a specific game
SELECT * FROM performances WHERE game_id = ?;

-- Insert a new performance record
INSERT INTO performances (player_id, game_id, points, rebounds, assists, turnovers, blocks, minutes_played)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- Update a performance record
UPDATE performances
SET points = ?, rebounds = ?, assists = ?, turnovers = ?, blocks = ?, minutes_played = ?
WHERE performance_id = ?;

-- Delete a performance record
DELETE FROM performances WHERE performance_id = ?;

-- ====================================================
-- Queries for Table: users
-- ====================================================

-- Get all users
SELECT * FROM users;

-- Get a user by ID
SELECT * FROM users WHERE id = ?;

-- Get a user by username
SELECT * FROM users WHERE username = ?;

-- Insert a new user
INSERT INTO users (username, email, hashed_password, role)
VALUES (?, ?, ?, ?);

-- Update a user's information
UPDATE users
SET username = ?, email = ?, hashed_password = ?, role = ?
WHERE id = ?;

-- Delete a user
DELETE FROM users WHERE id = ?;

-- ====================================================
-- Analytics Queries
-- ====================================================

-- Get total points scored by a player across all games
SELECT player_id, SUM(points) AS total_points
FROM performances
GROUP BY player_id;

-- Get the average points scored per game by team
SELECT AVG(team_score) AS average_team_score
FROM games;

-- Get all players with active injuries
SELECT p.*
FROM players p
JOIN injuries i ON p.player_id = i.player_id
WHERE i.recovery_status != 'Recovered';

-- Get the top 5 players by points in a specific game
SELECT p.first_name, p.last_name, perf.points
FROM players p
JOIN performances perf ON p.player_id = perf.player_id
WHERE perf.game_id = ?
ORDER BY perf.points DESC
LIMIT 5;
