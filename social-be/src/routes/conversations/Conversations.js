import express from "express";
import Conversation from "./Schema.js";

const conversationRouter = express.Router();

// create new a conversation
conversationRouter.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).send(savedConversation);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get a conversation

conversationRouter.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: {
        $in: [req.params.userId],
      },
    });
    res.status(200).send(conversation);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get conversation of two userId

conversationRouter.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).send(conversation);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default conversationRouter;
