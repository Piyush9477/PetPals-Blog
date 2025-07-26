const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectMongoDb = require("./init/mongobd");
const authRoutes = require("./routes/authroutes");
const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

//init app
const app = express();

//Database connection
connectMongoDb();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));

//Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/upload", uploadRoutes)

module.exports = app;

