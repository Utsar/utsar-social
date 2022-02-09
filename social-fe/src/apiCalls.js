import axios from "axios";
import backend from "./Backend";

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START " });
  try {
    const response = await backend.post("/auth/login", userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};
