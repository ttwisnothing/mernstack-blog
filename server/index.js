const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const { register, login, logout, checkUser } = require("./controller/auth");
const verifyToken = require("./middleware/auth");
const {
  createPost,
  updatePost,
  getFeedPosts,
  getUserPost,
} = require("./controller/post");
const { getUserPosts } = require("./controller/user");

// CONFIGURATIONS\
dotenv.config();
const app = express();
const uploadMiddleware = multer({ dest: "upload/" });
app.use(express.json());
app.use(cookieParser());
app.use("/upload", express.static(__dirname + "/upload"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// ROUTES WITH FILES
app.post("/post", verifyToken, uploadMiddleware.single("file"), createPost);
app.put("/post", verifyToken, uploadMiddleware.single("file"), updatePost);

// ROUTES
app.post("/register", register);
app.post("/login", login);
app.get("/profile", verifyToken, checkUser);
app.post("/logout", logout);
app.get("/post", getFeedPosts);
app.get("/post/:id", getUserPost);

// MONGOOSE SETUP
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
