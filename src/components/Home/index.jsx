import React from "react";
import SideNavbar from "../SideNavbar";
import DisplayTree from "../DisplayTree";
import AddEditNode from "../AddEditNode.jsx";
import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";

function Home() {
  const { currentTreeNote } = useStateContext();
  return (
    <div className="w-screen h-screen flex justify-center items-center relative overflow-hidden">
      <SideNavbar />
      {currentTreeNote ? <DisplayTree key={currentTreeNote.id} />
      : <div className="w-full h-full flex justify-center items-center text-2xl bg-gray-900 text-gray-200">＞﹏＜</div>  
    }
      <AddEditNode />
    </div>
  );
}

export default Home;
