
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();



app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// runs most pieces of middleware
require("./config")(app);

// handling routes here
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



// To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
