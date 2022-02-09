import "./conversation.css";
import { useState, useEffect } from "react";
import backend from "../../Backend";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const response = await backend.get("/users?userId=" + friendId);

        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <>
      <div className="conversation">
        <img
          src={
            user?.profilePicture
              ? PF + user.profilePicture
              : PF + "/profiles/noAvatar.png"
          }
          alt=""
          className="conversationImage"
        />
        <span className="conversationName">{user?.username}</span>
      </div>
    </>
  );
}
