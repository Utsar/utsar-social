import express, { Router } from "express";
import User from "../users/schema.js";

const usersRouter = express.Router();

// Get user

usersRouter.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    // !user && res.status(404).json("User not found");
    const { password, updatedAt, isAdmin, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update user
usersRouter.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.user.password, salt);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("User updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

// Delete user
usersRouter.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

// Get friends
usersRouter.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Follow user

usersRouter.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User followed");
      } else {
        res.status(403).json("Already following this user");
      }
      // await user.save();
      // res.status(200).json("User followed");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

// Unfollow user

usersRouter.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User unfollowed");
      } else {
        res.status(403).json("Already unfollowing this user");
      }
      // await user.save();
      // res.status(200).json("User unfollowed");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

export default usersRouter;
