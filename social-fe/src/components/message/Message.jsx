import "./message.css";
import { format } from "timeago.js";
export default function Message({ message, own }) {
  return (
    <>
      <div className={own ? "message own" : "message"}>
        <div className="messageTop">
          <img
            src="https://randomuser.me/api/portraits/lego/2.jpg"
            alt=""
            className="messageTopImage"
          />
          <p className="messageTopText">{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
      </div>
    </>
  );
}
