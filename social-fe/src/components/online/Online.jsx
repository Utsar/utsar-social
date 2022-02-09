import "./online.css";

function Online({ users }) {
  return (
    <>
      <li className="rightbarFriend">
        <div className="rightbarProfileImageContainer">
          <img
            src={users.profilePicture}
            alt=""
            className="rightbarProfileImage"
          />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarFriendName">{users.username}</span>
      </li>
    </>
  );
}

export default Online;
