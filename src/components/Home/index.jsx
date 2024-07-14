import React, { useEffect } from "react";
import SideNavbar from "../SideNavbar";
import DisplayTree from "../DisplayTree";
import AddEditNode from "../AddEditNode";
import { useStateContext } from "../../context/StateContext";
import { useFunctions } from "../../hooks/useFunctions";
import Navbar from "../Navbar";
import DisplayDocView from "../DisplayDocView";
import SharedMenu from "../SharedMenu";
import AlertMessageLogs from "../Helpers/AlertMessageLogs";
import { useDatabase } from "../../hooks/useDatabase";
import { useAuth } from "../../context/AuthContext";

function Home() {
  // destructure state from context
  const { currentFlowPlan, settings } = useStateContext();
  const { currentUser } = useAuth();

  const { databaseConfig } = settings;

  const { handleSync } = useDatabase();
  // destructure functions from custom hook

  useEffect(() => {
    if (databaseConfig?.autoSync === "true") {
      if (!currentUser) return;
      setTimeout(() => {
        console.log("Syncing Database");
        handleSync();
      }, 1000);
    }
  }, [currentUser]);

  return (
    <div
      id="top_container"
      className="w-dvw h-dvh flex justify-center items-center relative overflow-hidden"
    >
      <SharedMenu />
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
      <AlertMessageLogs />
    </div>
  );
}

export default Home;
