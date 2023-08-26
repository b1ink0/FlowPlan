// @ts-check
import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/Icons/CloseIcon";
import MovedIcon from "../../assets/Icons/MovedIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import MoveIcon from "../../assets/Icons/MoveIcon";
import BackIcon from "../../assets/Icons/BackIcon";
import EditBtnIcon from "../../assets/Icons/EditBtnIcon";
import { useStateContext } from "../../context/StateContext";
import { useFunctions } from "../../hooks/useFunctions";

function TestDisplayNode({ node }) {
  const { currentTreeNote } = useStateContext();
  const [key, setKey] = useState(0);
  useEffect(() => {
    console.log("node", node);
    setKey(key + 1);
  }, [currentTreeNote]);
  return (
    <div className="w-0 h-0 relative flex justify-center items-start">
      <DisplayNode node={node} t={0} r={node?.fp} location={[]} />
    </div>
  );
}

function DisplayNode({ node, t, r, location }) {
  const {
    db,
    currentTreeNote,
    setAddEditNode,
    currentExpanded,
    setCurrentExpanded,
    move,
    setMove,
  } = useStateContext();
  const {
    handleDeleteNodeWithoutItsChildren,
    handleDeleteNodeWithItsChildren,
    handleMoveNode,
  } = useFunctions();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const [deleteMenu, setDeleteMenu] = React.useState(false);
  const [update, setUpdate] = React.useState(0);

  const handleNode = (type) => {
    switch (type) {
      case "add":
        setAddEditNode({
          show: true,
          location: location,
          type: type,
        });
        break;
      case "edit":
        setAddEditNode({
          show: true,
          location: location,
          type: type,
        });
        break;
      case "delete":
        // handleDeleteNodeWithoutItsChildren(
        //   node,
        //   setParentIsExpanded,
        //   location[location.length - 1],
        //   setPaths
        // );
        break;
      case "deleteAll":
      // handleDeleteNodeWithItsChildren(
      //   node,
      //   setParentIsExpanded,
      //   location[location.length - 1],
      //   setPaths
      // );
      case "move":
        // handleMoveNode(node, location, setIsExpanded, setRootExpanded);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log("node", node);
  }, [currentTreeNote]);
  return (
    <>
      <div
        className="absolute transition-transform duration-500"
        style={{ transform: `translate(${(node?.fp - r) * 250}px,  ${t}px)` }}
      >
        <div
          //   ref={currentParentRef}
          className={`${
            isExpanded ? "cursor-default" : "cursor-pointer"
          } spread scale-0 ${showAll ? "w-fit max-w-[220px]" : "w-[220px]"} ${
            move.node ? (move.node.id === node.id ? "neon-border" : "") : ""
          } overflow-hidden  min-w-[220px] h-[100px] flex flex-col justify-between items-center border-2 border-gray-700 bg-gray-800 text-gray-200 rounded-md gap-1`}
        >
          {/* <span
            style={{ top: position.top + "px", left: position.left + "px" }}
            className="absolute block w-0 h-0 bg-red-500"
          ></span> */}
          {/* <span
           ref={nodeRef} 
           className="absolute w-0 h-0 bg-red-400"></span> */}
          <div className="w-full h-full flex flex-col justify-between items-center">
            <h3
              onClick={() => {
                setShowAll((showAll) => !showAll);
                setUpdate(update + 1);
              }}
              className="w-full text-center text-2xl truncate border-b border-gray-500 py-2 px-2 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
            >
              {node?.title}
              {/* {node?.fp * 250} */}
            </h3>
            {/* {node?.description !== "" && (
              <p className="w-full text-center p-2 truncate">
                {node?.description}
              </p>
            )} */}
            {/* {move.node &&
              (move.node.id === node.id ? (
                <div
                  onClick={() =>
                    setMove({
                      enable: false,
                      node: null,
                      location: null,
                      position: null,
                      parentPosition: null,
                    })
                  }
                  className="w-full h-full absolute top-0 left-0 bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2 hover:cursor-pointer"
                >
                  <div className="w-max-[250px] p-2 rounded-md h-max-[150px] flex flex-col justify-center items-center gap-3">
                    <div className="w-full flex flex-col justify-between items-center gap-2 hover:cursor-pointer">
                      <CloseIcon
                        stylePath={{ fill: "#15b952" }}
                        styleSvg={{ rotate: "45deg" }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full h-full group opacity-0 hover:opacity-100 transition-opacity duration-300  absolute top-0 left-0 bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2 ${
                    !(
                      (location.length > move.location?.length &&
                        move.location?.every(
                          (value, index) => value === location[index]
                        )) ||
                      move?.node?.parent?.id === node?.id
                    )
                      ? "hover:cursor-pointer"
                      : "hover:cursor-not-allowed"
                  }`}
                //   onClick={() => {
                //     !(
                //       location.length > move.location?.length &&
                //       move.location?.every(
                //         (value, index) => value === location[index]
                //       )
                //     ) || move?.node?.parent?.id === node?.id
                //       ? handleNode("move")
                //       : {};
                //   }}
                >
                  {(location.length > move.location?.length &&
                    move.location?.every(
                      (value, index) => value === location[index]
                    )) ||
                  move?.node?.parent?.id === node?.id ? (
                    <CloseIcon />
                  ) : (
                    <MovedIcon />
                  )}
                </div>
              ))}
            {deleteMenu && (
              <div className="spread absolute w-full h-full bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2">
                <div className="w-max-[250px] p-2 bg-gray-800 rounded-md h-max-[150px] flex flex-col justify-center items-center gap-3">
                  <div className="w-full flex justify-between items-center">
                    <button
                    //   onClick={() => handleNode("delete")}
                      title="Deleting a node will make its children become children of the node's parent."
                      className="w-full h-8 px-2 flex justify-center items-center relative text-xs bg-slate-700 py-1 rounded-md hover:bg-red-500 transition-colors duration-300"
                    >
                      <h3 className="text-sm w-full text-start">
                        Delete Only Node
                      </h3>
                      <div className="w-8 h-5">
                        <DeleteIcon />
                      </div>
                    </button>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <button
                    //   onClick={() => handleNode("deleteAll")}
                      className="w-full h-8 px-2 flex justify-between items-center relative text-xs bg-slate-700 py-1 rounded-md hover:bg-red-500 transition-colors duration-300"
                    >
                      <h3 className="text-sm text-start w-full">
                        Delete Node & Its Children
                      </h3>
                      <div className="w-8 h-5">
                        <DeleteIcon />
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => setDeleteMenu(false)}
                    className="w-full h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )} */}
            <div className="w-full flex justify-center items-center gap-2 p-2">
              {showAll && (
                <button
                  className={`${
                    location.length === 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-cyan-600 transition-colors duration-300`}
                  //   onClick={() => {
                  //     if (location.length > 0) {
                  //       setMove({
                  //         enable: true,
                  //         node: node,
                  //         location: location,
                  //         position: {
                  //           p1x: pathPosition.p1x,
                  //           p1y: pathPosition.p1y,
                  //         },
                  //       });
                  //     } else {
                  //     }
                  //   }}
                >
                  <MoveIcon />
                </button>
              )}
              <button
                className="w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-purple-600 transition-colors duration-300"
                onClick={() => handleNode("add")}
              >
                <span className="absolute group-hover:rotate-90 transition-all duration-300 block w-[3px] rounded-md h-4 bg-gray-200"></span>
                <span className="absolute group-hover:rotate-90 transition-all duration-300 block w-4 rounded-md h-[3px] bg-gray-200"></span>
              </button>
              {node?.children.length > 0 && (
                <button
                  className="w-8 h-8 group text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                  //   onClick={async () => {
                  //     setIsExpanded(!isExpanded);
                  //     setUpdate(update + 1);
                  //     const newPrev = {
                  //       ...currentExpanded,
                  //       [node?.id]: !isExpanded,
                  //     };
                  //     await db.treeNotesExpanded
                  //       .where("refId")
                  //       .equals(currentTreeNote.refId)
                  //       .modify((expanded) => {
                  //         expanded.expanded = newPrev;
                  //       });
                  //   }}
                >
                  <span
                    className={`w-full h-full ${
                      isExpanded ? "-rotate-90" : "rotate-90"
                    } flex justify-center items-center transition-all duration-300 transform group-hover:scale-125`}
                  >
                    <BackIcon />
                  </span>
                </button>
              )}
              <button
                className="w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-green-700 transition-colors duration-300"
                onClick={() => handleNode("edit")}
              >
                <EditBtnIcon />
              </button>
              {showAll && (
                <button
                  className="w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-red-500 transition-colors duration-300"
                  onClick={() => setDeleteMenu(true)}
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {node?.children?.map((child, i) => {
        return (
          <DisplayNode
            key={child.id}
            node={child}
            t={t + 200}
            r={r}
            location={location.concat([i])}
          />
        );
      })}
    </>
  );
}

export default TestDisplayNode;
