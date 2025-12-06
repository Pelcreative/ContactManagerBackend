require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();


connectDB();


app.use(helmet());
app.use(express.json({ limit: "10kb" }));


const FRONTEND_URL = process.env.FRONTEND_URL; 
const LOCAL_ORIGINS = ["http://localhost:5173", "http://localhost:5174"];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 

      if (LOCAL_ORIGINS.includes(origin)) return callback(null, true);

      if (origin === FRONTEND_URL) return callback(null, true);

      return callback(
        new Error(`CORS blocked: ${origin} is not allowed by the server`),
        false
      );
    },
    credentials: true,
  })
);


app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 120,
  })
);


app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));


app.get("/", (req, res) => {
  res.json({ message: "Backend is running on Render!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));

module.exports = app;
