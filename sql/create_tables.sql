-- Basketball Database Schema
-- This schema defines tables for a basketball project including players, games, injuries, performances, and users.
-- The tables are created in an order that satisfies foreign key dependencies.

-- ====================================================
-- DROP TABLES IF THEY EXIST
-- ====================================================
DROP TABLE IF EXISTS performances;
DROP TABLE IF EXISTS injuries;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;

-- ====================================================
-- TABLE: players
-- ====================================================
CREATE TABLE players (
    player_id      INT NOT NULL AUTO_INCREMENT,
    first_name     VARCHAR(50) NOT NULL,
    last_name      VARCHAR(50) NOT NULL,
    position       VARCHAR(20) DEFAULT NULL,
    jersey_number  INT DEFAULT NULL,
    weight         DECIMAL(5,2) DEFAULT NULL,
    height         DECIMAL(4,2) DEFAULT NULL,
    year           VARCHAR(10) DEFAULT NULL,
    age            INT DEFAULT NULL,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================
-- TABLE: games
-- ====================================================
CREATE TABLE games (
    game_id         INT NOT NULL AUTO_INCREMENT,
    game_date       DATE NOT NULL,
    opponent        VARCHAR(50) NOT NULL,
    location        VARCHAR(50) DEFAULT NULL,
    team_score      INT DEFAULT 0,
    opponent_score  INT DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================
-- TABLE: injuries
-- ====================================================
CREATE TABLE injuries (
    injury_id       INT NOT NULL AUTO_INCREMENT,
    player_id       INT NOT NULL,
    injury_type     VARCHAR(100) NOT NULL,
    injury_date     DATE DEFAULT NULL,
    recovery_status VARCHAR(50) DEFAULT NULL,
    expected_return DATE DEFAULT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (injury_id),
    KEY fk_injuries_player (player_id),
    CONSTRAINT fk_injuries_player FOREIGN KEY (player_id)
        REFERENCES players(player_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================
-- TABLE: performances
-- ====================================================
CREATE TABLE performances (
    performance_id  INT NOT NULL AUTO_INCREMENT,
    player_id       INT NOT NULL,
    game_id         INT NOT NULL,
    points          INT DEFAULT 0,
    rebounds        INT DEFAULT 0,
    assists         INT DEFAULT 0,
    turnovers       INT DEFAULT 0,
    blocks          INT DEFAULT 0,
    minutes_played  DECIMAL(4,1) DEFAULT 0.0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (performance_id),
    UNIQUE KEY uix_performance_player_game (player_id, game_id),
    KEY fk_performances_game (game_id),
    CONSTRAINT fk_performances_game FOREIGN KEY (game_id)
        REFERENCES games(game_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_performances_player FOREIGN KEY (player_id)
        REFERENCES players(player_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================
-- TABLE: users
-- ====================================================
CREATE TABLE users (
    id              INT NOT NULL AUTO_INCREMENT,
    username        VARCHAR(50) DEFAULT NULL,
    email           VARCHAR(100) DEFAULT NULL,
    hashed_password VARCHAR(128) DEFAULT NULL,
    role            VARCHAR(20) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY ix_users_email (email),
    UNIQUE KEY ix_users_username (username),
    KEY ix_users_id (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

