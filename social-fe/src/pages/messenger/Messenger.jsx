import React, { useRef } from "react";
import "./messenger.css";
import Topbar from "../../components/topbar/Topbar.jsx";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import backend from "../../Backend";
import { io } from "socket.io-client";

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [recieveMessage, setRecieveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  // make socket run only once & receiving message
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("recieveMessage", (data) => {
      setRecieveMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // receive only messages from itended chat
  useEffect(() => {
    recieveMessage &&
      currentChat?.members.includes(recieveMessage.sender) &&
      setMessages((previous) => [...previous, recieveMessage]);
  }, [recieveMessage]);

  // socket & online users
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followers.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  // fetching conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await backend.get("/conversations/" + user._id);

        setConversations(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user._id]);

  // fetching chats
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await backend.get("/messages/" + currentChat?._id);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  // handling messages to scroll into view
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // handling text area send message event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      text: newMessage,
      sender: user._id,
      conversationId: currentChat._id,
    };
    // send message
    const receiverId = currentChat.members.find(
      (member) => member._id !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
    try {
      const response = await backend.post("/messages", message);
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for Friends"
              className="chatMenuInput"
            />
            {/* map out frinends conversations */}
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation key={c._id} conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        key={m._id}
                        message={m}
                        own={m.sender === user._id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="write something..."
                    className="chatBoxBottomInput"
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                  <button
                    className="chatBoxBottomButton"
                    onClick={handleSubmit}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Messenger;
