# True Blue Basketball

This repository is organized to facilitate the integration of FastAPI, React, SQL (via MySQL Workbench), and PowerBI for our database class project. A multi-functional DBMS for the basketball team at MTSU, showcasing their statistics for games, individual performance, and health conditions, allows students, coaches, and recruiters alike to find the information they need for their favorite athlete.

## File Structure

```
root/
├── backend/
│   ├── app/
│   │   ├── main.py            # Entry point for FastAPI application
│   │   ├── routes/            # API routes
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── crud/              # Database CRUD operations
│   │   ├── config.py          # Configuration file
│   │   └── utils/             # Utility functions
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── public/                # Public assets
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # React pages
│   │   ├── services/          # API service calls
│   │   ├── App.js             # Main React component
│   │   └── index.js           # React entry point
│   └── package.json           # Node.js dependencies
├── sql/
│   ├── create_tables.sql      # SQL script for creating tables
│   ├── insert_data.sql        # SQL script for inserting data
│   └── queries.sql            # SQL queries
├── powerbi/
│   ├── reports/               # PowerBI reports
│   ├── data_model.pbix        # PowerBI data model file
│   └── scripts/               # Scripts to extract data for PowerBI
└── README.md                  # Documentation
```

## Team Roles

- **Frontend Development**: Justin, Jaelin
- **Database Management**: Clifford
- **Backend Development**: Jonah

Each member is responsible for their respective parts of the project. Collaboration is key to ensuring smooth integration between frontend, backend, and database components.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository.
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

## Contribution Guidelines

- Ensure you are working within your assigned role.
- Commit frequently and use descriptive commit messages.
- Open pull requests for any major changes and request reviews.

## License

This project is for academic purposes only. Unauthorized use is prohibited.
