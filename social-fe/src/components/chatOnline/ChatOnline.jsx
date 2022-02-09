import { useState, useEffect } from "react";
import backend from "../../Backend";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await backend.get("/users/friends/" + currentId);
        setFriends(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(
      friends.filter((friend) => onlineUsers.includes(friend._id))
    );
  }, [onlineUsers, friends]);

  const handleClick = async (user) => {
    try {
      const response = await backend.get(
        `/conversations/find/${currentId}/${user._id}`
      );
      setCurrentChat(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="chatOnline">
        {onlineFriends.map((o) => (
          <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
            <div className="chatOnlineImageContainer">
              <img
                src={
                  o?.profilePicture
                    ? PF + o?.profilePicture
                    : PF + "/profiles/noAvatar.png"
                }
                alt=""
                className="chatOnlineImage"
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o.username}</span>
          </div>
        ))}
      </div>
    </>
  );
}
