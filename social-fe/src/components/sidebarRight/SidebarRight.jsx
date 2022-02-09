import "./sidebarRight.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";

export default function SidebarRight({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.following.includes(user?._id)
  );

  // useEffect(() => {
  //   setFollowed(currentUser.following.includes(user?._id));
  // }, [currentUser, user._id]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.log(error);
    }
    setFollowed(!followed);
  };

  const HomeSidebarRight = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="/Assets/gift.png" alt="" className="birthdayImage" />
          <span className="birthdayText">
            <b>Beer</b> and <b>3 other frineds </b>have bday today
          </span>
        </div>
        <img src="/Assets/ad.jpg" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((user) => (
            <Online key={user.id} users={user} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileSidebarRight = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "UnFollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User info</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City: </span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From: </span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship: </span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "Married"
                : "-"}
            </span>
          </div>
          <h4 className="rightbarTitle">Friends</h4>
          <div className="rightbarFollowers">
            {friends.map((friend) => (
              <Link
                key={friend._id}
                style={{ textDecoration: "none" }}
                to={"/profile/" + friend.username}
              >
                <div className="rightbarFollower">
                  <img
                    src={
                      friend.profilePicture
                        ? PF + friend.profilePicture
                        : PF + "profiles/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowerImage"
                  />
                  <span className="rightbarFollowerName">
                    {friend.username}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="sidebarRight">
        <div className="rightbarWrapper">
          {user ? <ProfileSidebarRight /> : <HomeSidebarRight />}
        </div>
      </div>
    </>
  );
}
