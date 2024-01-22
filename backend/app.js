const express = require('express');
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");


const userRoutes = require("./src/routes/user_routes");

// from .env file
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(cors("http://localhost:3000"));
app.use(express.static('coaching'));
app.use(helmet());
app.use(morgan("common"));

// Default route
app.get("/", (req, res) => {
    res.send(`We are live on ${PORT}`);
});

// Define routes for user related operations
app.use("/user", userRoutes);

// Start the server and listen on the specified port
app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`);});
