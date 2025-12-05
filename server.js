require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

// CORS configuration for Vercel & localhost
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://contact-manager-three-phi.vercel.app"   // your frontend
  ],
  credentials: true
}));

// Rate limiter
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120
}));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running on Vercel!" });
});

// Start server for Vercel
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));

module.exports = app;
