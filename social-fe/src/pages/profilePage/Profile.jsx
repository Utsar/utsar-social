import "./profile.css";
import Feed from "../../components/feed/Feed.jsx";
import SidebarLeft from "../../components/sidebarLeft/SidebarLeft.jsx";
import SidebarRight from "../../components/sidebarRight/SidebarRight.jsx";
import Topbar from "../../components/topbar/Topbar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <SidebarLeft />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "profiles/noCover.jpg"
                }
                alt=""
                className="profileCoverImage"
              />
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "profiles/noAvatar.png"
                }
                alt=""
                className="profileUserImage"
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDescription">{user.description}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <SidebarRight user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
