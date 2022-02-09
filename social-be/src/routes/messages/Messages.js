import express from "express";
import Message from "./Schema.js";

const messageRouter = express.Router();

// add a new message
messageRouter.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).send(savedMessage);
  } catch {
    res.status(500).send(error);
  }
});

// get all messages
messageRouter.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).send(messages);
  } catch {
    res.status(500).send(error);
  }
});

export default messageRouter;
