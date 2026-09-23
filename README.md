YogKriya

YogKriya is a wellness and fitness web application that combines modern exercise practices with traditional yoga and wellness routines. The application is designed to help users explore exercises, nutrition, workout plans, and personalized routines from one place.

Live Demo

https://yogkriya.vercel.app/

Features

Modern and clean wellness-focused interface

Yoga and traditional exercise routines

Built-in exercise library

Nutrition and diet-related information

YouTube-based exercise and nutrition videos

Workout and wellness planning

Routine-building support

Progress tracking foundation

Responsive web interface

Backend API for application data

Tech Stack

Frontend

React

TypeScript

Tailwind CSS

shadcn/ui

Backend

FastAPI

Python

PostgreSQL

SQLAlchemy

Alembic

APIs / Services

YouTube API for exercise and nutrition video content

Project Structure

YogKriya/
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── app/
│   ├── models/
│   ├── routers/
│   ├── services/
│   └── ...
│
└── README.md

The exact folder structure may differ depending on the current version of the project.

Getting Started

Prerequisites

Make sure you have the following installed:

Python 3.11+

Node.js

npm

PostgreSQL

Backend Setup

Move into the backend directory:

cd backend

Create and activate a virtual environment:

python -m venv venv

Windows PowerShell:

.env\Scripts\Activate.ps1

Install the Python dependencies:

pip install -r requirements.txt

Create your environment configuration file and add the required database and API settings.

Start the FastAPI server:

uvicorn app.main:app --reload

The API will normally be available at:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs

Frontend Setup

Move into the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Open the local URL shown by Vite in your terminal.

Database

YogKriya uses PostgreSQL for persistent application data.

Alembic is used for database migrations.

Typical migration commands:

alembic upgrade head

To create a new migration after changing database models:

alembic revision --autogenerate -m "describe your change"

Environment Variables

Create a .env file in the backend and configure the values required by your local setup.

Example:

DATABASE_URL=postgresql://username:password@localhost:5432/yogkriya
YOUTUBE_API_KEY=your_youtube_api_key

Do not commit .env files or API keys to GitHub.

API

The backend provides REST APIs for the application's data and functionality.

FastAPI automatically provides interactive API documentation through Swagger UI:

http://127.0.0.1:8000/docs

You can use Swagger UI to inspect available endpoints and test requests without a separate API client.

Content

YogKriya currently focuses on areas such as:

Yoga

Traditional exercises

Modern workouts

Nutrition

Diet planning

Exercise routines

Wellness tracking

The application includes several built-in exercises and uses YouTube content to provide additional exercise and nutrition resources.

Future Improvements

Planned areas for expansion include:

More yoga and traditional exercise programs

Gym and workout plans

Personalized diet plans

Routine maker

Progress tracking

More detailed user profiles

Additional wellness recommendations

Improved personalization

Deployment

The frontend is deployed on Vercel:

https://yogkriya.vercel.app/

The backend can be deployed separately on a service that supports FastAPI and PostgreSQL.

Contributing

Fork the repository.

Create a new branch:

git checkout -b feature/your-feature

Make your changes.

Test the application.

Commit your changes:

git add .
git commit -m "Add your feature"

Push the branch:

git push origin feature/your-feature

Open a pull request.

License

Add the project's license here if the repository uses a specific open-source license.

Author

Aditya Bhuria

GitHub: https://github.com/Aditya7638

Live App: https://yogkriya.vercel.app/
