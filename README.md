# Buenos Vinos Backend

## Overview

This Express.js and MongoDB backend provides a RESTful API for the Buenos Vinos application. It handles user authentication, wine/region/grape CRUD, and user-specific saved-cellar functionality.

## Features

* JWT-based authentication (signup, login, protected routes)
* CRUD endpoints for Wines, Regions, Grapes
* Save/unsave wines to a personal cellar
* Public endpoint for browsing shared wines
* Environment-based CORS configuration
* Centralized error handling

## Tech Stack

* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT)
* dotenv for environment variables
* Morgan for logging
* Cors for cross-origin requests

## Prerequisites

* Node.js v16+
* npm or yarn
* A MongoDB connection string

## Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/buenos-vinos-backend.git
   cd buenos-vinos-backend
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## Environment Variables

Create a `.env` file in the project root with:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/buenosvinos
JWT_SECRET=your_jwt_secret_here
ALLOWED_ORIGINS=http://localhost:3000,https://buenosvinos.netlify.app
PORT=5000
```

* **MONGODB\_URI**: your MongoDB connection string
* **JWT\_SECRET**: secret key for signing JWTs
* **ALLOWED\_ORIGINS**: comma-separated list of allowed CORS origins
* **PORT**: port number for the server

## Running Locally

```bash
npm run dev
# or
yarn dev
```

This uses nodemon. The server will listen on `http://localhost:5000` by default.

## API Endpoints

### Authentication

* `POST /api/auth/signup` – create new user
* `POST /api/auth/login` – authenticate and receive JWT
* `GET /api/auth/verify` – verify JWT and return user data

### Wines

* `GET /api/wine` – list all wines (protected)
* `GET /api/wine/public` – list shared wines (public)
* `GET /api/wine/:wineId` – get wine by ID
* `POST /api/wine` – create a wine (protected)
* `PUT /api/wine/:wineId` – update wine (protected, owner only)
* `DELETE /api/wine/:wineId` – delete wine (protected, owner only)
* `PATCH /api/wine/:wineId/visibility` – toggle public/private (protected, owner only)

### Cellar

* `GET /api/wine/my-cellar` – get saved wines for current user (protected)
* `POST /api/wine/save/:wineId` – save a wine (protected)
* `DELETE /api/wine/save/:wineId` – unsave a wine (protected)

### Regions & Grapes

* `GET /api/regions`, `POST /api/regions`
* `GET /api/grapes`, `POST /api/grapes`

## Folder Structure

config/           # app configuration (db, middleware)
models/           # Mongoose schemas
routes/           # Express route definitions
middleware/       # JWT authentication, error handling
app.js            # Express app setup
server.js         # server bootstrap


git clone : https://github.com/Los-No-Sabemos/BuenosVinos-Backend
cd buenos-vinos-backend
Install dependencies
npm install

Run the application
npm run dev
🚀 Demo
💻 Frontend Demo: [Netlify Link](https://buenosvinos.netlify.app/)