import express from "express";
import bcrypt from "bcrypt";
import User from "../users/schema.js";

const authRouter = express.Router();

// Register
authRouter.post("/register", async (req, res) => {
  try {
    // generate new passowrd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    // save user to database
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("User not found");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    !isMatch && res.status(400).json("Password is incorrect");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default authRouter;
