import express from "express";
import mongoose from "mongoose";
// import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import usersRouter from "./routes/users/users.js";
import listEndpoints from "express-list-endpoints";
import authRouter from "./routes/auth/auth.js";
import postRouter from "./routes/post/post.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import conversationRouter from "./routes/conversations/Conversations.js";
import messageRouter from "./routes/messages/Messages.js";

dotenv.config();

const server = express();

const PORT = process.env.PORT || 3002;
const DATABASE_URI = process.env.MONGO_URI;

// ********* multer *********
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
server.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).send("File uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});
// **********path and url**********
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
console.log(__dirname);
console.log(__filename);

// **********Middlewares**********

// server.use(cors());
server.use(express.json());
server.use(helmet());
server.use(morgan("common"));

// **********Routes**********
server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);
server.use("/api/posts", postRouter);
server.use("/api/conversations", conversationRouter);
server.use("/api/messages", messageRouter);

console.table(listEndpoints(server));

// **********Connect to MongoDB**********

mongoose.connect(
  DATABASE_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to database");
  }
);

mongoose.connection.on("connected", () => {
  server.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
  });
});
