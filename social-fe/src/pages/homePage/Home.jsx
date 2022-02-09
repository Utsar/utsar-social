import React from "react";
import "./home.css";
import Feed from "../../components/feed/Feed.jsx";
import SidebarLeft from "../../components/sidebarLeft/SidebarLeft.jsx";
import SidebarRight from "../../components/sidebarRight/SidebarRight.jsx";
import Topbar from "../../components/topbar/Topbar.jsx";

const Home = () => {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <SidebarLeft />
        <Feed />
        <SidebarRight />
      </div>
    </>
  );
};

export default Home;
