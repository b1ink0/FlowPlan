import React from "react";
import SideNavbar from "../SideNavbar";
import DisplayTree from "../DisplayTree";
import AddEditNode from "../AddEditNode";
import { useStateContext } from "../../context/StateContext";
import { useFunctions } from "../../hooks/useFunctions";

function Home() {
  // destructure state from context
  const { currentTreeNote } = useStateContext();
  // destructure functions from custom hook
  const { handleImportTreeNote } = useFunctions();
  return (
    <div
      id="top_container"
      className="w-screen h-screen flex justify-center items-center relative overflow-hidden"
    >
      <SideNavbar />
      {/* If currentTreeNote is set then display tree */}
      {currentTreeNote ? (
        <DisplayTree key={currentTreeNote.id} />
      ) : (
        <div className="w-full h-full flex justify-center items-center text-2xl bg-gray-900 text-gray-200">
          ＞﹏＜
        </div>
      )}
      {/* AddEditNode component for adding and editing a node */}
      <AddEditNode />
    </div>
  );
}

export default Home;
