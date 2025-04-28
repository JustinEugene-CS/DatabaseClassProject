# True Blue Basketball

This repository is organized to facilitate the integration of FastAPI, React, and SQLite. A multi-functional DBMS for the basketball team at MTSU, showcasing their statistics for games, individual performance, and health conditions, allows students, coaches, and recruiters alike to find the information they need for their favorite athlete.

## File Structure

```
root/
├── athlete-dashboard-fixed
│   ├── public/                # Public assets
|   |   └── index.html 
│   ├── src/
│   │   ├── components/        # React components
|   |   |   ├── AthleteCard.js
|   |   |   └── SearchBar.js
│   │   ├── pages/             # React pages
|   |   |   ├── Athletes.js
|   |   |   |── Favorites.js
|   |   |   ├── Games.js
|   |   |   |── Home.js
|   |   |   ├── Injuries.js
|   |   |   └── Login.js
│   │   ├── App.css
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── App.js             # Main React component
│   │   └── index.js           # React entry point
│   └── package.json           # Node.js dependencies
├── backend/
│   ├── main.py            # Entry point for FastAPI application
│   ├── server.js 
│   └── requirements.txt       # Python dependencies

├── sql/
│   ├── basketball_schema_sqlite.sql      # SQL script for creating tables
│   ├── sqlite_insert_complete.sql        # SQL script for inserting data
│   └── queries.sql            # SQL queries
└── README.md                  # Documentation
```

## Team Roles

- **Frontend Development**: Jaelin, Justin
- **Database Management**: Jaelin, Clifford
- **Backend Development**: Jaelin, Jonah

Each member is responsible for their respective parts of the project. Collaboration is key to ensuring smooth integration between frontend, backend, and database components.

## Technologies Used:

Backend: FastAPI for REST API, SQLite for database management

Frontend: React.js for building the user interface

Database: SQLite, used to store player, game, and injury data

## Features

Player Data: Track player statistics, personal information, performance metrics, and bio.

Game Statistics: View team scores, opponent scores, attendance, and game types (home/away).

Injury Data: Track injuries for players, including type, recovery status, and expected return dates.

Favorites: Users can favorite their favorite players for quick access.

Role-based Access: Different access levels for viewers and coaches. Coaches can add and delete players and games, while viewers can only view data.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository.
   - git clone https://github.com/your-username/True-Blue-Basketball.git
   - cd True-Blue-Basketball
2. Set up the backend:
   - Navigate to the `backend` directory.
   - Install dependencies using `pip install -r requirements.txt`.
   - Run the FastAPI application with `uvicorn app.main:app --reload`.
3. Set up the frontend:
   - Navigate to the `frontend` directory.
   - Install dependencies using `npm install`.
   - Start the React application with `npm start`.
4. Set up the database:
   - Use the SQL scripts in the `sql` directory to create tables and insert initial data in MySQL Workbench.
5. Integrate PowerBI:
   - Use the files in the `powerbi` directory to work on PowerBI reports and scripts.

## API Endpoints

POST /register/: Register a new user (username, email, password, role).

POST /login/: Log in with username and password, returning a JWT token.

GET /players: Get a list of players.

GET /games: Get a list of games.

POST /add-game/: Add a new game (only accessible by coaches).

DELETE /delete-game/{game_id}: Delete a game (only accessible by coaches).

POST /favorites: Add a favorite player.

DELETE /favorites: Remove a favorite player.

## Features Overview

User Authentication: Sign up and log in with role-based authentication. Viewers have limited access, while coaches can add, delete, and modify data.

Player and Game Management: Coaches can add players and games, as well as delete them from the database. Viewers can only view player and game data.

Search Functionality: Users can search players and games using search bars for easy filtering.

Pagination: The system supports pagination for displaying players and games in pages.

## Contribution Guidelines

- Ensure you are working within your assigned role.
- Commit frequently and use descriptive commit messages.
- Open pull requests for any major changes and request reviews.

## License

This project is for academic purposes only. Unauthorized use is prohibited.
