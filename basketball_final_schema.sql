-- Schema for basketball project

DROP TABLE IF EXISTS injuries;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;

CREATE TABLE players (
  player_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  position VARCHAR(20) DEFAULT NULL,
  jersey_number INT DEFAULT NULL,
  year VARCHAR(20) DEFAULT NULL,
  age INT DEFAULT NULL,
  height DECIMAL(4,1) DEFAULT NULL,
  weight DECIMAL(5,2) DEFAULT NULL,
  games_played INT DEFAULT 0,
  games_started INT DEFAULT 0,
  minutes INT DEFAULT 0,
  minutes_per_game DECIMAL(4,1) DEFAULT 0.0,
  fg_made INT DEFAULT 0,
  fg_attempts INT DEFAULT 0,
  fg_pct DECIMAL(5,3) DEFAULT 0.000,
  three_made INT DEFAULT 0,
  three_attempts INT DEFAULT 0,
  three_pct DECIMAL(5,3) DEFAULT 0.000,
  ft_made INT DEFAULT 0,
  ft_attempts INT DEFAULT 0,
  ft_pct DECIMAL(5,3) DEFAULT 0.000,
  off_rebounds INT DEFAULT 0,
  def_rebounds INT DEFAULT 0,
  total_rebounds INT DEFAULT 0,
  rebounds_per_game DECIMAL(4,1) DEFAULT 0.0,
  personal_fouls INT DEFAULT 0,
  dq INT DEFAULT 0,
  assists INT DEFAULT 0,
  turnovers INT DEFAULT 0,
  blocks INT DEFAULT 0,
  steals INT DEFAULT 0,
  points INT DEFAULT 0,
  points_per_game DECIMAL(4,1) DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE games (
  game_id INT NOT NULL AUTO_INCREMENT,
  game_date DATE NOT NULL,
  opponent VARCHAR(50) NOT NULL,
  location VARCHAR(50) DEFAULT NULL,
  team_score INT DEFAULT 0,
  opponent_score INT DEFAULT 0,
  attendance INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE injuries (
  injury_id INT NOT NULL AUTO_INCREMENT,
  player_id INT NOT NULL,
  injury_type VARCHAR(100) NOT NULL,
  injury_date DATE DEFAULT NULL,
  recovery_status VARCHAR(50) DEFAULT NULL,
  expected_return DATE DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (injury_id),
  KEY fk_injuries_player (player_id),
  CONSTRAINT fk_injuries_player FOREIGN KEY (player_id)
    REFERENCES players(player_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: favorites
CREATE TABLE favorites (
  favorite_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  item_type ENUM('player','game') NOT NULL,
  item_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (favorite_id),
  KEY fk_fav_user (user_id),
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50),
  email VARCHAR(100),
  hashed_password VARCHAR(128),
  role VARCHAR(20),
  PRIMARY KEY (id),
  UNIQUE KEY ix_users_email (email),
  UNIQUE KEY ix_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- INSERT INTO players

INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (1, 'Jestin', 'Porter', 'G', 3, 'Senior', 22, 73.0, 180.0, 34, 34, 1149, 33.8, 176, 427, 0.412, 84, 230, 0.365, 74, 90, 0.822, 25, 72, 97, 2.9, 55, 1, 42, 57, 6, 38, 510, 15.0);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (2, 'Essam', 'Mostafa', 'F', 44, 'Graduate Student', 25, 81.0, 250.0, 33, 33, 896, 27.2, 197, 324, 0.608, 5, 11, 0.455, 80, 128, 0.625, 111, 192, 303, 9.2, 91, 1, 40, 40, 30, 39, 479, 14.5);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (3, 'Camryn', 'Weston', 'G', 24, 'Redshirt Senior', 24, 75.0, 190.0, 34, 9, 950, 27.9, 142, 342, 0.415, 37, 133, 0.278, 89, 118, 0.754, 32, 98, 130, 3.8, 84, 3, 118, 69, 3, 38, 410, 12.1);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (4, 'Jlynn', 'Counter', 'G', 2, 'Senior', 0, 75.0, 195.0, 31, 25, 849, 27.4, 118, 272, 0.434, 38, 125, 0.304, 52, 69, 0.754, 12, 117, 129, 4.2, 50, 0, 109, 45, 11, 31, 326, 10.5);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (5, 'Kamari', 'Lands', 'G', 22, 'Junior', 21, 80.0, 225.0, 22, 13, 442, 20.1, 65, 179, 0.363, 30, 102, 0.294, 19, 27, 0.704, 9, 42, 51, 2.3, 34, 0, 26, 20, 6, 18, 179, 8.1);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (6, 'Torey', 'Alston', 'F', 10, 'Redshirt Freshman', 20, 80.0, 200.0, 34, 20, 681, 20.0, 77, 135, 0.57, 2, 10, 0.2, 56, 102, 0.549, 56, 120, 176, 5.2, 75, 1, 29, 42, 33, 14, 212, 6.2);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (7, 'Justin', 'Bufford', 'G', 4, 'Senior', 23, 78.0, 190.0, 34, 34, 837, 24.6, 54, 157, 0.344, 24, 91, 0.264, 41, 67, 0.612, 30, 74, 104, 3.1, 76, 1, 31, 39, 17, 26, 173, 5.1);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (8, 'Tre', 'Green', 'G', 11, 'Junior', 20, 75.0, 190.0, 31, 0, 412, 13.3, 46, 98, 0.469, 29, 72, 0.403, 19, 24, 0.792, 11, 40, 51, 1.6, 25, 0, 9, 20, 1, 6, 140, 4.5);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (9, 'Chris', 'Loofe', 'F', 13, 'Sophomore', 20, 83.0, 230.0, 34, 1, 461, 13.6, 52, 99, 0.525, 5, 26, 0.192, 26, 50, 0.52, 38, 78, 116, 3.4, 74, 1, 8, 33, 35, 4, 135, 4.0);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (10, 'Jarred', 'Hall', 'F', 5, 'Sophomore', 0, 80.0, 205.0, 3, 0, 16, 5.3, 3, 3, 1.0, 2, 2, 1.0, 0, 0, 0.0, 2, 3, 5, 1.7, 1, 0, 0, 2, 1, 0, 8, 2.7);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (11, 'Alec', 'Oglesby', 'G', 1, 'Graduate Student', 23, 77.0, 200.0, 4, 0, 30, 7.5, 2, 9, 0.222, 1, 6, 0.167, 1, 2, 0.5, 1, 1, 2, 0.5, 1, 0, 3, 1, 0, 3, 6, 1.5);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (12, 'Jacob', 'Johnson', 'G', 15, 'Redshirt Senior', 23, 77.0, 195.0, 20, 1, 194, 9.7, 10, 20, 0.5, 0, 0, 0.0, 0, 4, 0.0, 7, 18, 25, 1.3, 12, 0, 7, 3, 2, 7, 20, 1.0);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (13, 'Christian', 'Fussell', 'F', 7, 'Senior', 23, 82.0, 225.0, 7, 0, 36, 5.1, 2, 12, 0.167, 1, 7, 0.143, 0, 1, 0.0, 3, 4, 7, 1.0, 5, 0, 1, 2, 2, 0, 5, 0.7);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (14, 'Isiah', 'Lightsy', 'G', 0, 'Senior', 21, 76.0, 190.0, 5, 0, 10, 2.0, 1, 5, 0.2, 1, 4, 0.25, 0, 0, 0.0, 0, 3, 3, 0.6, 2, 0, 0, 0, 1, 0, 3, 0.6);
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, year, age, height, weight, games_played, games_started, minutes, minutes_per_game, fg_made, fg_attempts, fg_pct, three_made, three_attempts, three_pct, ft_made, ft_attempts, ft_pct, off_rebounds, def_rebounds, total_rebounds, rebounds_per_game, personal_fouls, dq, assists, turnovers, blocks, steals, points, points_per_game) VALUES (15, 'Jack', 'Jubenville', 'G', 55, 'Redshirt Junior', 22, 72.0, 180.0, 5, 0, 12, 2.4, 0, 1, 0.0, 0, 0, 0.0, 2, 3, 0.667, 0, 1, 1, 0.2, 3, 0, 4, 3, 0, 0, 2, 0.4);

-- INSERT INTO games


INSERT INTO games (game_date, opponent, location, team_score, opponent_score, attendance)
VALUES 
('2025-01-09', 'KENNESAW ST.', 'Home', 84, 79, 2051),
('2025-01-11', 'JACKSONVILLE ST.', 'Home', 81, 64, 2237),
('2025-01-18', 'WESTERN KY.', 'Home', 71, 57, 6512),
('2025-01-23', 'Sam Houston', 'Away', 77, 75, 987),
('2025-01-25', 'Louisiana Tech', 'Away', 69, 75, 2414),
('2025-01-30', 'NEW MEXICO ST.', 'Home', 57, 61, 3307),
('2025-02-01', 'UTEP', 'Home', 71, 68, 4012),
('2025-02-06', 'Jacksonville St.', 'Away', 63, 77, 2943),
('2025-02-08', 'Kennesaw St.', 'Away', 76, 75, 1858),
('2025-02-15', 'Western Ky.', 'Away', 87, 77, 4647),
('2025-02-20', 'LOUISIANA TECH', 'Home', 74, 85, 3505),
('2025-02-22', 'SAM HOUSTON', 'Home', 74, 70, 4413),
('2025-02-27', 'New Mexico St.', 'Away', 71, 66, 5253),
('2025-03-01', 'UTEP', 'Away', 76, 75, 5854),
('2025-03-06', 'LIBERTY', 'Home', 81, 86, 4858),
('2025-03-08', 'FIU', 'Home', 78, 56, 4018),
('2025-03-13', 'Louisiana Tech', 'Home', 77, 75, 3108),
('2025-03-14', 'Jacksonville St.', 'Home', 68, 70, 2506),
('2025-03-18', 'CHATTANOOGA', 'Home', 103, 109, 3505);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;


-- INSERT INTO injuries


INSERT INTO injuries (player_id, injury_type, injury_date, recovery_status, expected_return)
VALUES
(1, 'Ankle Sprain', '2025-01-05', 'Recovered', NULL),
(3, 'Hamstring Strain', '2025-01-15', 'In progress', '2025-02-10'),
(5, 'Shoulder Dislocation', '2025-02-01', 'Recovered', NULL),
(6, 'Wrist Fracture', '2025-02-15', 'In progress', '2025-03-20'),
(9, 'Knee Contusion', '2025-01-10', 'Recovered', NULL),
(12, 'Back Tightness', '2025-02-05', 'In progress', '2025-03-01');
/*!40000 ALTER TABLE `injuries` ENABLE KEYS */;


-- INSERT INTO users


INSERT INTO users (id, username, email, hashed_password, role) VALUES 
(1, 'coach1', 'coach1@example.com', '$2b$12$EXAMPLEHASH1', 'coach'),
(2, 'coach2', 'coach2@example.com', '$2b$12$EXAMPLEHASH2', 'coach');
