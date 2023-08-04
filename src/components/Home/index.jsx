import React from "react";
import SideNavbar from "../SideNavbar";
import DisplayTree from "../DisplayTree";
import AddEditNode from "../AddEditNode";
import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";
import { useFunctions } from "../../hooks/useFunctions";

function Home() {
  const { currentTreeNote } = useStateContext();
  const { handleImportTreeNote } = useFunctions();
  const parsedUrl = new URL(window.location.href);
  return (
    <div className="w-screen h-screen flex justify-center items-center relative overflow-hidden">
      {parsedUrl.searchParams.get("note") && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-fit h-fit p-10 bg-gray-900 rounded-lg flex flex-col justify-center items-center border-2 border-gray-700">
            <div className="text-2xl text-gray-200">
              Do you want to import <span className="
              font-bold
              ">{parsedUrl.searchParams.get("name")} </span>note?
            </div>
            <div className="w-full flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() =>
                  handleImportTreeNote(parsedUrl.searchParams.get("note"), 2)
                }
                className="w-full h-10 bg-slate-700 text-white hover:bg-slate-600 transition-colors duration-200 cursor-pointer rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="w-full h-10 bg-slate-700 text-white hover:bg-slate-600 transition-colors duration-200 cursor-pointer rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <SideNavbar />
      {currentTreeNote ? (
        <DisplayTree key={currentTreeNote.id} />
      ) : (
        <div className="w-full h-full flex justify-center items-center text-2xl bg-gray-900 text-gray-200">
          ＞﹏＜
        </div>
      )}
      <AddEditNode />
    </div>
  );
}

export default Home;
