import axios from "axios";

const backend = axios.create({
  baseURL: process.env.MONGO_URI,
});

export default backend;
