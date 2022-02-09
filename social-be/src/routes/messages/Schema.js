import Mongoose from "mongoose";

const MessageSchema = new Mongoose.Schema(
  {
    conversationId: {
      type: String,
    },

    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

export default Mongoose.model("Message", MessageSchema);
