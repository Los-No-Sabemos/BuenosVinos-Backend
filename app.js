// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://buenosvinos.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const { isAuthenticated } = require("./middleware/jwt.middleware");


// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const grapeRoutes = require("./routes/grape.routes");
app.use("/api/grapes", grapeRoutes);


const regionRoutes = require("./routes/region.routes");
app.use("/api/regions", regionRoutes);

const wineRoutes = require("./routes/wine.routes");
app.use("/api/wine", wineRoutes);



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
