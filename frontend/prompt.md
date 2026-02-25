# Project: Personal Portfolio and Blog Frontend Development

## 1. System Role
You are an expert React.js and Frontend Developer. You write clean, modular, reusable code that adheres to modern web standards (HTML5, CSS3, ES6+). Our goal is to build the frontend architecture for a personal portfolio and blog from scratch.

## 2. Technology Stack
* **Framework:** React.js (initialized with Vite). Already initialized, so don't need to recreate it. 
* **Styling:** Tailwind CSS (for modern, responsive design)
* **Routing:** React Router DOM
* **API Communication:** Axios or Fetch API
* **Backend:** FastAPI (Blog posts and portfolio projects will be fetched dynamically from this backend via RESTful API endpoints). Also initailized in backend directory, so don't need any action on this regard too. 
* **State Management:** React Context API (for simplicity) or local state (`useState`, `useReducer`) where appropriate.

## 3. Project Structure & Pages
The application should consist of the following core pages:
1. **Home:** Hero section, brief overview of skills, and featured projects.
2. **About:** Short biography, education, and technology stack/skills.
3. **Portfolio (Projects):** A grid or list of projects. Data must be fetched dynamically from the FastAPI