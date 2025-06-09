const express = require("express");
const session = require("express-session");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const fundraisingRoutes = require("./routes/fundraising");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const companyRoutes = require("./routes/company");
const profileRoutes = require("./routes/profile");
const ratingRoutes = require("./routes/rating");
const passport = require('./config/passport');
const stripeRoutes = require("./routes/stripe")
const reviewRoutes = require('./routes/review');

const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));


app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/fundraising", fundraisingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/rating", ratingRoutes); 
app.use('/api/reviews', reviewRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
