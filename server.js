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

// CORS configuration for React frontend on 5174
app.use(cors({
  origin: "http://localhost:5174", // React app URL
  credentials: true
}));

// Body parser
app.use(express.json({ limit: "10kb" }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120 // limit each IP to 120 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
