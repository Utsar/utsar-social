import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import axios from "axios";

const Share = () => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const description = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      description: description.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.image = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImage"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "profiles/noAvatar.png"
            }
            alt="profile"
          />
          <input
            placeholder={"Whats's in your mind " + user.username + "?"}
            className="shareInput"
            ref={description}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImageContainer">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="shareImage"
            />
            <Cancel
              className="shareCancelImage"
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
