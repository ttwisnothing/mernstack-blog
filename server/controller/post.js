const fs = require("fs");
const jwt = require("jsonwebtoken");
const PostModel = require("../models/Post");

// CREATE POST
const createPost = async (req, res) => {
  // Get the file information from the request object
  const { originalname, path } = req.file;

  // Extract the file extension from the file name
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];

  // Generate a new file path with the extension
  const newPath = path + "." + ext;

  // Rename the file to the new path
  fs.renameSync(path, newPath);

  // Get the ID of the authenticated user from the request object
  const { id } = req.user;

  // Get the post information from the request body
  const { title, summary, content } = req.body;

  // Create a new post document in the database
  const postDoc = await PostModel.create({
    title,
    summary,
    content,
    cover: newPath,
    author: id,
  });

  // Return the newly created post document
  res.json(postDoc);
};

// UPDATE POST
const updatePost = async (req, res) => {
  let newPath = null;
  // If there's a file uploaded, rename and store it
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { id, title, summary, content } = req.body;
  // Find the post by ID
  const postDoc = await PostModel.findById(id);
  // Check if the current user is the author of the post
  const isAuthor =
    JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
  if (!isAuthor) {
    return res.status(400).json("you are not the author");
  }

  // Update the post with new data
  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    {
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    },
    { new: true } // Return the updated document
  ).populate("author", ["username"]);

  res.json(updatedPost);
};

// GET FEED POSTS
const getFeedPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

// GET USER POST
const getUserPost = async (req, res) => {
  try {
    // Get the post ID from the request params
    const { id } = req.params;

    // Find the post by ID and populate the author field with their username
    const postDoc = await PostModel.findById(id).populate("author", [
      "username",
    ]);

    // If the post was not found, return a 404 status
    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Return the post as a JSON response
    res.json(postDoc);
  } catch (error) {
    // If an error occurs, log it to the console and return a 500 status
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  updatePost,
  getFeedPosts,
  getUserPost,
};
