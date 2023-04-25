const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

// REGISTER
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Generate a salt and hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a user in the database
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json(newUser); // Send status 201 Created and the created user data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" }); // Send status 500 Internal Server Error and warning message to the client
  }
};

// LOGIN
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await UserModel.findOne({ username });

    if (!userDoc) {
      // user not found
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    const passOk = await bcrypt.compare(password, userDoc.password);

    if (!passOk) {
      // incorrect password
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign(
      { username, id: userDoc._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // token expires in 1 hour
      }
    );

    res.cookie("token", token).json({
      id: userDoc._id,
      username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// CHECK USER
const checkUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(req.user);
};

// LOGOUT
const logout = (req, res) => {
  try {
    res.clearCookie("token").json("ok");
  } catch (error) {
    console.error(error);
    res.status(500).json("error logging out");
  }
};

module.exports = { register, login, checkUser, logout };
