const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");

dotenv.config();

const app = express();
const corsOptions = {
  origin: [
  
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
    'https://ideal-tribble-vw56rpqj6ggfvwx-5173.app.github.dev',
    "https://zk-bank-privacy-loan-binance.vercel.app"
  ],  
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  credentials: true, // Include credentials like cookies or authorization headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register routes
app.use("/auth", authRoutes);
app.use("/loans", loanRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ZK-Bank Privacy Loan (Binance) API!",
    availableEndpoints: ["/auth", "/loans"],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
