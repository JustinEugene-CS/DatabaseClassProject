-- ====================================================
-- INSERT DATA
-- ====================================================

-- data for table: players
INSERT INTO players (player_id, first_name, last_name, position, jersey_number, weight, height, year, age, created_at) VALUES 
(1, 'John', 'Doe', 'Guard', 1, 180.00, 72.00, 'Freshman', 19, '2025-02-06 10:39:38'),
(2, 'Michael', 'Smith', 'Forward', 12, 210.50, 77.50, 'Sophomore', 20, '2025-02-06 10:39:38'),
(3, 'Aaron', 'Johnson', 'Center', 33, 250.00, 80.00, 'Senior', 22, '2025-02-06 10:39:38'),
(4, 'Torey', 'Alston', 'Forward', 2, 190.00, 80.00, 'Freshman', 18, '2025-02-28 09:13:24'),
(5, 'Chris', 'Loofe', 'Forward', 13, 220.00, 83.00, 'Freshman', 19, '2025-02-28 09:13:24'),
(6, 'Tre', 'Green', 'Guard', 11, 190.00, 75.00, 'Sophomore', 20, '2025-02-28 09:13:24'),
(7, 'Josh', 'Ogundele', 'Center', 23, 300.00, 83.00, 'Junior', 21, '2025-02-28 09:13:24'),
(8, 'Ty', 'Mosley', 'Guard', 1, 190.00, 77.00, 'Senior', 22, '2025-02-28 09:13:24'),
(9, 'Torey', 'Alston', 'Forward', 2, 190.00, 80.00, 'Freshman', 18, '2025-02-28 09:24:56'),
(10, 'Chris', 'Loofe', 'Forward', 13, 220.00, 83.00, 'Freshman', 19, '2025-02-28 09:24:56'),
(11, 'Tre', 'Green', 'Guard', 11, 190.00, 75.00, 'Sophomore', 20, '2025-02-28 09:24:56'),
(12, 'Josh', 'Ogundele', 'Center', 23, 300.00, 83.00, 'Junior', 21, '2025-02-28 09:24:56'),
(13, 'Ty', 'Mosley', 'Guard', 1, 190.00, 77.00, 'Senior', 22, '2025-02-28 09:24:56');

-- data for table: games
INSERT INTO games (game_id, game_date, opponent, location, team_score, opponent_score, created_at) VALUES 
(1, '2025-01-15', 'University of Memphis', 'Home', 78, 65, '2025-02-06 10:39:38'),
(2, '2025-01-22', 'Tennessee State', 'Away', 82, 76, '2025-02-06 10:39:38'),
(3, '2025-02-01', 'Vanderbilt', 'Home', 68, 70, '2025-02-06 10:39:38'),
(4, '2025-01-15', 'University of Memphis', 'Home', 78, 65, '2025-02-28 09:23:54'),
(5, '2025-01-22', 'Tennessee State', 'Away', 82, 76, '2025-02-28 09:23:54'),
(6, '2025-02-01', 'Vanderbilt', 'Home', 68, 70, '2025-02-28 09:23:54'),
(7, '2025-02-08', 'Western Kentucky', 'Away', 75, 80, '2025-02-28 09:23:54'),
(8, '2025-02-15', 'Belmont University', 'Home', 90, 85, '2025-02-28 09:23:54'),
(9, '2025-01-15', 'University of Memphis', 'Home', 78, 65, '2025-02-28 09:24:56'),
(10, '2025-01-22', 'Tennessee State', 'Away', 82, 76, '2025-02-28 09:24:56'),
(11, '2025-02-01', 'Vanderbilt', 'Home', 68, 70, '2025-02-28 09:24:56'),
(12, '2025-02-08', 'Western Kentucky', 'Away', 75, 80, '2025-02-28 09:24:56'),
(13, '2025-02-15', 'Belmont University', 'Home', 90, 85, '2025-02-28 09:24:56');

-- data for table: injuries
INSERT INTO injuries (injury_id, player_id, injury_type, injury_date, recovery_status, expected_return, created_at) VALUES 
(1, 3, 'Ankle Sprain', '2025-01-20', 'In progress', '2025-02-15', '2025-02-06 10:39:38'),
(2, 2, 'Shoulder Injury', '2025-01-15', 'Recovered', NULL, '2025-02-06 10:39:38'),
(3, 1, 'Hamstring Strain', '2025-01-05', 'Recovered', NULL, '2025-02-28 09:24:56'),
(4, 2, 'Shoulder Injury', '2025-01-15', 'Recovered', NULL, '2025-02-28 09:24:56'),
(5, 3, 'Ankle Sprain', '2025-01-20', 'In progress', '2025-02-15', '2025-02-28 09:24:56');

-- data for table: performances
INSERT INTO performances (performance_id, player_id, game_id, points, rebounds, assists, turnovers, blocks, minutes_played, created_at) VALUES 
(1, 1, 1, 15, 3, 5, 2, 0, 30.5, '2025-02-06 10:39:38'),
(2, 2, 1, 20, 10, 2, 1, 1, 28.0, '2025-02-06 10:39:38'),
(3, 3, 1, 10, 12, 1, 0, 2, 25.5, '2025-02-06 10:39:38'),
(4, 1, 2, 18, 4, 4, 3, 0, 31.2, '2025-02-06 10:39:38'),
(5, 2, 2, 22, 7, 3, 2, 1, 33.1, '2025-02-06 10:39:38'),
(6, 3, 3, 19, 9, 2, 4, 2, 29.0, '2025-02-06 10:39:38'),
(57, 1, 3, 14, 5, 6, 2, 0, 35.0, '2025-02-28 09:27:39'),
(58, 2, 3, 19, 8, 1, 3, 1, 36.5, '2025-02-28 09:27:39'),
(59, 1, 4, 21, 6, 5, 4, 0, 37.0, '2025-02-28 09:27:39'),
(60, 2, 4, 30, 10, 2, 5, 1, 38.0, '2025-02-28 09:27:39'),
(61, 1, 5, 15, 3, 8, 2, 0, 30.0, '2025-02-28 09:27:39'),
(62, 2, 5, 18, 9, 2, 2, 1, 32.5, '2025-02-28 09:27:39'),
(63, 3, 5, 22, 11, 1, 1, 2, 28.5, '2025-02-28 09:27:39');

-- data for table: users
INSERT INTO users (id, username, email, hashed_password, role) VALUES 
(1, 'string', 'string', '$2b$12$Isvu7OkQ3/7j9M1fM.j/j.OmQcm5bc67fGPQ6xILrmusP5KNNZEQS', 'string'),
(2, 'coach1', 'coach1@example.com', '$2b$12$LrM5yfH.uHGZdcSIWSomyemRNgLd3pIGwFCodelHfo52qs8QUyb6W', 'coach'),
(3, 'coach2', 'coach2@examplemail.com', '$2b$12$ect81WPn1mhijXacF5fT0./tCG3RmUgIcPo5cGWkNdx3H.m/aSOx2', 'coach');
