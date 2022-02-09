import "./friends.css";

const Friends = ({ user }) => {
  return (
    <>
      <li className="sidebarLeftFriend">
        <img
          className="sidebarLeftFriendImage"
          src={user.profilePicture}
          alt=""
        />
        <span className="sidebarLeftFriendName">{user.username}</span>
      </li>
    </>
  );
};

export default Friends;
