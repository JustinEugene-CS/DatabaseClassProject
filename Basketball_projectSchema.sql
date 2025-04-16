-- MySQL dump 10.13  Distrib 8.0.40, for macos14 (arm64)
--
-- Host: localhost    Database: basketdb
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `game_id` int NOT NULL AUTO_INCREMENT,
  `game_date` date NOT NULL,
  `opponent` varchar(50) NOT NULL,
  `location` varchar(50) DEFAULT NULL,
  `team_score` int DEFAULT '0',
  `opponent_score` int DEFAULT '0',
  `attendance` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
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
UNLOCK TABLES;

--
-- Table structure for table `injuries`
--

DROP TABLE IF EXISTS `injuries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `injuries` (
  `injury_id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `injury_type` varchar(100) NOT NULL,
  `injury_date` date DEFAULT NULL,
  `recovery_status` varchar(50) DEFAULT NULL,
  `expected_return` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`injury_id`),
  KEY `fk_injuries_player` (`player_id`),
  CONSTRAINT `fk_injuries_player` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `injuries`
--

LOCK TABLES `injuries` WRITE;
/*!40000 ALTER TABLE `injuries` DISABLE KEYS */;
INSERT INTO injuries (player_id, injury_type, injury_date, recovery_status, expected_return)
VALUES
(1, 'Ankle Sprain', '2025-01-05', 'Recovered', NULL),
(3, 'Hamstring Strain', '2025-01-15', 'In progress', '2025-02-10'),
(5, 'Shoulder Dislocation', '2025-02-01', 'Recovered', NULL),
(6, 'Wrist Fracture', '2025-02-15', 'In progress', '2025-03-20'),
(9, 'Knee Contusion', '2025-01-10', 'Recovered', NULL),
(12, 'Back Tightness', '2025-02-05', 'In progress', '2025-03-01');
/*!40000 ALTER TABLE `injuries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `players` (
  `player_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `position` VARCHAR(20) DEFAULT NULL,
  `jersey_number` INT DEFAULT NULL,
  `year` VARCHAR(10) DEFAULT NULL,
  `age` INT DEFAULT NULL,
  -- MTSU season stats
  `games_played` INT DEFAULT 0,
  `games_started` INT DEFAULT 0,
  `minutes` INT DEFAULT 0,
  `minutes_per_game` DECIMAL(4,1) DEFAULT 0.0,
  `fg_made` INT DEFAULT 0,
  `fg_attempts` INT DEFAULT 0,
  `fg_pct` DECIMAL(5,3) DEFAULT 0.000,
  `three_made` INT DEFAULT 0,
  `three_attempts` INT DEFAULT 0,
  `three_pct` DECIMAL(5,3) DEFAULT 0.000,
  `ft_made` INT DEFAULT 0,
  `ft_attempts` INT DEFAULT 0,
  `ft_pct` DECIMAL(5,3) DEFAULT 0.000,
  `off_rebounds` INT DEFAULT 0,
  `def_rebounds` INT DEFAULT 0,
  `total_rebounds` INT DEFAULT 0,
  `rebounds_per_game` DECIMAL(4,1) DEFAULT 0.0,
  `personal_fouls` INT DEFAULT 0,
  `dq` INT DEFAULT 0,
  `assists` INT DEFAULT 0,
  `turnovers` INT DEFAULT 0,
  `blocks` INT DEFAULT 0,
  `steals` INT DEFAULT 0,
  `points` INT DEFAULT 0,
  `points_per_game` DECIMAL(4,1) DEFAULT 0.0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO players (first_name, last_name, position, jersey_number, year, age,
  games_played, games_started, minutes, minutes_per_game,
  fg_made, fg_attempts, fg_pct,
  three_made, three_attempts, three_pct,
  ft_made, ft_attempts, ft_pct,
  off_rebounds, def_rebounds, total_rebounds, rebounds_per_game,
  personal_fouls, dq, assists, turnovers, blocks, steals,
  points, points_per_game,
  height, weight)
VALUES
('Jestin', 'Porter', 'G', 3, 'Senior', 22,
 34, 34, 1149, 33.8,
 176, 427, 0.412,
 84, 230, 0.365,
 74, 90, 0.822,
 25, 72, 97, 2.9,
 55, 1, 42, 57, 6, 38,
 510, 15.0,
 73.0, 180.0),

('Essam', 'Mostafa', 'F', 44, 'Graduate Student', 25,
 33, 33, 896, 27.2,
 197, 324, 0.608,
 5, 11, 0.455,
 80, 128, 0.625,
 111, 192, 303, 9.2,
 91, 1, 40, 40, 30, 39,
 479, 14.5,
 81.0, 250.0),

('Camryn', 'Weston', 'G', 24, 'Redshirt Senior', 24,
 34, 9, 950, 27.9,
 142, 342, 0.415,
 37, 133, 0.278,
 89, 118, 0.754,
 32, 98, 130, 3.8,
 84, 3, 118, 69, 3, 38,
 410, 12.1,
 75.0, 190.0),

('Jlynn', 'Counter', 'G', 2, 'Senior', NULL,
 31, 25, 849, 27.4,
 118, 272, 0.434,
 38, 125, 0.304,
 52, 69, 0.754,
 12, 117, 129, 4.2,
 50, 0, 109, 45, 11, 31,
 326, 10.5,
 75.0, 195.0),

('Kamari', 'Lands', 'G', 22, 'Junior', 21,
 22, 13, 442, 20.1,
 65, 179, 0.363,
 30, 102, 0.294,
 19, 27, 0.704,
 9, 42, 51, 2.3,
 34, 0, 26, 20, 6, 18,
 179, 8.1,
 80.0, 225.0),

('Torey', 'Alston', 'F', 10, 'Redshirt Freshman', 20,
 34, 20, 681, 20.0,
 77, 135, 0.570,
 2, 10, 0.200,
 56, 102, 0.549,
 56, 120, 176, 5.2,
 75, 1, 29, 42, 33, 14,
 212, 6.2,
 80.0, 200.0),

('Justin', 'Bufford', 'G', 4, 'Senior', 23,
 34, 34, 837, 24.6,
 54, 157, 0.344,
 24, 91, 0.264,
 41, 67, 0.612,
 30, 74, 104, 3.1,
 76, 1, 31, 39, 17, 26,
 173, 5.1,
 78.0, 190.0),

('Tre', 'Green', 'G', 11, 'Junior', 20,
 31, 0, 412, 13.3,
 46, 98, 0.469,
 29, 72, 0.403,
 19, 24, 0.792,
 11, 40, 51, 1.6,
 25, 0, 9, 20, 1, 6,
 140, 4.5,
 75.0, 190.0),

('Chris', 'Loofe', 'F', 13, 'Sophomore', 20,
 34, 1, 461, 13.6,
 52, 99, 0.525,
 5, 26, 0.192,
 26, 50, 0.520,
 38, 78, 116, 3.4,
 74, 1, 8, 33, 35, 4,
 135, 4.0,
 83.0, 230.0),

('Jarred', 'Hall', 'F', 5, 'Sophomore', NULL,
 3, 0, 16, 5.3,
 3, 3, 1.000,
 2, 2, 1.000,
 0, 0, 0.000,
 2, 3, 5, 1.7,
 1, 0, 0, 2, 1, 0,
 8, 2.7,
 80.0, 205.0),

('Alec', 'Oglesby', 'G', 1, 'Graduate Student', 23,
 4, 0, 30, 7.5,
 2, 9, 0.222,
 1, 6, 0.167,
 1, 2, 0.500,
 1, 1, 2, 0.5,
 1, 0, 3, 1, 0, 3,
 6, 1.5,
 77.0, 200.0),

('Jacob', 'Johnson', 'G', 15, 'Redshirt Senior', 23,
 20, 1, 194, 9.7,
 10, 20, 0.500,
 0, 0, 0.000,
 0, 4, 0.000,
 7, 18, 25, 1.3,
 12, 0, 7, 3, 2, 7,
 20, 1.0,
 77.0, 195.0),

('Christian', 'Fussell', 'F', 7, 'Senior', 23,
 7, 0, 36, 5.1,
 2, 12, 0.167,
 1, 7, 0.143,
 0, 1, 0.000,
 3, 4, 7, 1.0,
 5, 0, 1, 2, 2, 0,
 5, 0.7,
 82.0, 225.0),

('Isiah', 'Lightsy', 'G', 0, 'Senior', 21,
 5, 0, 10, 2.0,
 1, 5, 0.200,
 1, 4, 0.250,
 0, 0, 0.000,
 0, 3, 3, 0.6,
 2, 0, 0, 0, 1, 0,
 3, 0.6,
 76.0, 190.0),

('Jack', 'Jubenville', 'G', 55, 'Redshirt Junior', 22,
 5, 0, 12, 2.4,
 0, 1, 0.000,
 0, 0, 0.000,
 2, 3, 0.667,
 0, 1, 1, 0.2,
 3, 0, 4, 3, 0, 0,
 2, 0.4,
 72.0, 180.0);
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `hashed_password` varchar(128) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  UNIQUE KEY `ix_users_username` (`username`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'string','string','$2b$12$Isvu7OkQ3/7j9M1fM.j/j.OmQcm5bc67fGPQ6xILrmusP5KNNZEQS','string'),(2,'coach1','coach1@example.com','$2b$12$LrM5yfH.uHGZdcSIWSomyemRNgLd3pIGwFCodelHfo52qs8QUyb6W','coach'),(3,'coach2','coach2@examplemail.com','$2b$12$ect81WPn1mhijXacF5fT0./tCG3RmUgIcPo5cGWkNdx3H.m/aSOx2','coach'),(4,'Nzioka','nnziokajones@gmail.com','$2b$12$O/9f92nJrqg5aDu8mcvk1uFpvHj/8gsGNAZb5Yo1lamn5IpQ/btUG','coach');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10 20:45:10
