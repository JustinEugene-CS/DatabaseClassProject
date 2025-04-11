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
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'2025-01-15','University of Memphis','Home',78,65,'2025-02-06 10:39:38'),(2,'2025-01-22','Tennessee State','Away',82,76,'2025-02-06 10:39:38'),(3,'2025-02-01','Vanderbilt','Home',68,70,'2025-02-06 10:39:38'),(4,'2025-01-15','University of Memphis','Home',78,65,'2025-02-28 09:23:54'),(5,'2025-01-22','Tennessee State','Away',82,76,'2025-02-28 09:23:54'),(6,'2025-02-01','Vanderbilt','Home',68,70,'2025-02-28 09:23:54'),(7,'2025-02-08','Western Kentucky','Away',75,80,'2025-02-28 09:23:54'),(8,'2025-02-15','Belmont University','Home',90,85,'2025-02-28 09:23:54'),(9,'2025-01-15','University of Memphis','Home',78,65,'2025-02-28 09:24:56'),(10,'2025-01-22','Tennessee State','Away',82,76,'2025-02-28 09:24:56'),(11,'2025-02-01','Vanderbilt','Home',68,70,'2025-02-28 09:24:56'),(12,'2025-02-08','Western Kentucky','Away',75,80,'2025-02-28 09:24:56'),(13,'2025-02-15','Belmont University','Home',90,85,'2025-02-28 09:24:56');
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
INSERT INTO `injuries` VALUES (1,3,'Ankle Sprain','2025-01-20','In progress','2025-02-15','2025-02-06 10:39:38'),(2,2,'Shoulder Injury','2025-01-15','Recovered',NULL,'2025-02-06 10:39:38'),(3,1,'Hamstring Strain','2025-01-05','Recovered',NULL,'2025-02-28 09:24:56'),(4,2,'Shoulder Injury','2025-01-15','Recovered',NULL,'2025-02-28 09:24:56'),(5,3,'Ankle Sprain','2025-01-20','In progress','2025-02-15','2025-02-28 09:24:56');
/*!40000 ALTER TABLE `injuries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performances`
--

DROP TABLE IF EXISTS `performances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performances` (
  `performance_id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `game_id` int NOT NULL,
  `points` int DEFAULT '0',
  `rebounds` int DEFAULT '0',
  `assists` int DEFAULT '0',
  `turnovers` int DEFAULT '0',
  `blocks` int DEFAULT '0',
  `minutes_played` decimal(4,1) DEFAULT '0.0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`performance_id`),
  UNIQUE KEY `uix_performance_player_game` (`player_id`,`game_id`),
  KEY `fk_performances_game` (`game_id`),
  CONSTRAINT `fk_performances_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_performances_player` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performances`
--

LOCK TABLES `performances` WRITE;
/*!40000 ALTER TABLE `performances` DISABLE KEYS */;
INSERT INTO `performances` VALUES (1,1,1,15,3,5,2,0,30.5,'2025-02-06 10:39:38'),(2,2,1,20,10,2,1,1,28.0,'2025-02-06 10:39:38'),(3,3,1,10,12,1,0,2,25.5,'2025-02-06 10:39:38'),(4,1,2,18,4,4,3,0,31.2,'2025-02-06 10:39:38'),(5,2,2,22,7,3,2,1,33.1,'2025-02-06 10:39:38'),(6,3,3,19,9,2,4,2,29.0,'2025-02-06 10:39:38'),(57,1,3,14,5,6,2,0,35.0,'2025-02-28 09:27:39'),(58,2,3,19,8,1,3,1,36.5,'2025-02-28 09:27:39'),(59,1,4,21,6,5,4,0,37.0,'2025-02-28 09:27:39'),(60,2,4,30,10,2,5,1,38.0,'2025-02-28 09:27:39'),(61,1,5,15,3,8,2,0,30.0,'2025-02-28 09:27:39'),(62,2,5,18,9,2,2,1,32.5,'2025-02-28 09:27:39'),(63,3,5,22,11,1,1,2,28.5,'2025-02-28 09:27:39');
/*!40000 ALTER TABLE `performances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `players` (
  `player_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `position` varchar(20) DEFAULT NULL,
  `jersey_number` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(4,2) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` VALUES (1,'John','Doe','Guard',1,180.00,72.00,'Freshman',19,'2025-02-06 10:39:38'),(2,'Michael','Smith','Forward',12,210.50,77.50,'Sophomore',20,'2025-02-06 10:39:38'),(3,'Aaron','Johnson','Center',33,250.00,80.00,'Senior',22,'2025-02-06 10:39:38'),(4,'Torey','Alston','Forward',2,190.00,80.00,'Freshman',18,'2025-02-28 09:13:24'),(5,'Chris','Loofe','Forward',13,220.00,83.00,'Freshman',19,'2025-02-28 09:13:24'),(6,'Tre','Green','Guard',11,190.00,75.00,'Sophomore',20,'2025-02-28 09:13:24'),(7,'Josh','Ogundele','Center',23,300.00,83.00,'Junior',21,'2025-02-28 09:13:24'),(8,'Ty','Mosley','Guard',1,190.00,77.00,'Senior',22,'2025-02-28 09:13:24'),(9,'Torey','Alston','Forward',2,190.00,80.00,'Freshman',18,'2025-02-28 09:24:56'),(10,'Chris','Loofe','Forward',13,220.00,83.00,'Freshman',19,'2025-02-28 09:24:56'),(11,'Tre','Green','Guard',11,190.00,75.00,'Sophomore',20,'2025-02-28 09:24:56'),(12,'Josh','Ogundele','Center',23,300.00,83.00,'Junior',21,'2025-02-28 09:24:56'),(13,'Ty','Mosley','Guard',1,190.00,77.00,'Senior',22,'2025-02-28 09:24:56');
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
