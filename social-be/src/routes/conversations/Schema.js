import Mongoose from "mongoose";

const ConversationSchema = new Mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default Mongoose.model("Conversation", ConversationSchema);
