import React from "react";
import SideNavbar from "../SideNavbar";
import DisplayTree from "../DisplayTree";
import AddEditNode from "../AddEditNode";
import { useStateContext } from "../../context/StateContext";
import { useFunctions } from "../../hooks/useFunctions";
import Navbar from "../Navbar";
import DisplayDocView from "../DisplayDocView";

function Home() {
  // destructure state from context
  const { currentFlowPlan } = useStateContext();
  // destructure functions from custom hook
  const { handleImportFlowPlan } = useFunctions();
  return (
    <div
      id="top_container"
      className="w-dvw h-dvh flex justify-center items-center relative overflow-hidden"
    >
      <Navbar />
      <SideNavbar />
      {/* If currentFlowPlan is set then display tree */}
      {currentFlowPlan ? (
        <DisplayTree key={currentFlowPlan.id} />
      ) : (
        <div className="w-full h-full flex justify-center items-center text-2xl bg-[var(--bg-primary)] text-gray-200">
          ＞﹏＜
        </div>
      )}
      <DisplayDocView />
      {/* AddEditNode component for adding and editing a node */}
      <AddEditNode />
    </div>
  );
}

export default Home;
