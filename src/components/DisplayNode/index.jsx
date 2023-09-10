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
import ReorderNode from "../ReorderNode";

function DisplayNode({ node }) {
  const { animation } = useStateContext();
  const [init, setInit] = useState(animation ? true : false);
  useEffect(() => {
    if (!animation) return;
    setTimeout(() => {
      setInit(false);
    }, 1000);
  }, []);
  return (
    <div className="w-0 h-0 relative flex justify-center items-start">
      <Node
        init={init}
        node={node}
        t={0}
        r={node?.fp}
        location={[]}
        ptranslate={{ x: 0, y: 0 }}
      />
    </div>
  );
}

function Node({ node, t, r, location, ptranslate, init, parent = null }) {
  const { setAddEditNode, move, setMove, update, animation } =
    useStateContext();
  const {
    handleDeleteNodeWithoutItsChildren,
    handleDeleteNodeWithItsChildren,
    handleMoveNode,
    handleReorderNode,
    handleExpanded,
  } = useFunctions();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const [deleteMenu, setDeleteMenu] = React.useState(false);
  const [translate, setTranslate] = useState({
    x: !animation || init ? (node?.fp - r) * 250 : ptranslate?.x || 0,
    y: !animation || init ? t : ptranslate?.y + 100 || 0,
  });

  const handleNode = (type, data) => {
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
        handleDeleteNodeWithoutItsChildren(
          parent,
          node,
          location[location.length - 1]
        );
        break;
      case "deleteAll":
        handleDeleteNodeWithItsChildren(parent, node);
      case "move":
        handleMoveNode(node);
        break;
      case "reorder":
        handleReorderNode(parent, data, location[location.length - 1]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setTranslate({ x: (node?.fp - r) * 250, y: t });
  }, [update]);
  return (
    <>
      {/* Reorder Helper */}
      {move?.node &&
        move?.node?.id !== node?.id &&
        !(
          location.length > move.location?.length &&
          move.location?.every((value, index) => value === location[index])
        ) &&
        parent?.children?.length > 1 && (
          <ReorderNode
            handleNode={handleNode}
            translate={translate}
            r={r}
            location={location}
            node={node}
            parent={parent}
            key={"reorder-" + node.id}
          />
        )}
      <div
        className="absolute duration-500"
        style={{
          transform: `translate(${translate.x}px,  ${translate.y}px)`,
          transition: animation ? "transform 0.5s ease-in-out" : "none",
        }}
      >
        <div
          className={`
          ${isExpanded ? "cursor-default" : "cursor-pointer"}
            spread scale-0 
          ${showAll ? "w-fit max-w-[220px]" : "w-[220px]"} 
          ${move.node ? (move.node.id === node.id ? "neon-border" : "") : ""}
          ${
            move.node
              ? !(
                  (location.length > move.location?.length &&
                    move.location?.every(
                      (value, index) => value === location[index]
                    )) ||
                  move?.parent?.id === node?.id
                )
                ? "neon-border"
                : "neon-red-border"
              : ""
          }
            overflow-hidden  min-w-[220px] h-[100px] flex flex-col justify-between items-center border-2 border-gray-700 bg-gray-800 text-gray-200 rounded-md gap-1
        `}
        >
          <div className="w-full h-full flex flex-col justify-between items-center">
            <h3 className="w-full text-center text-2xl truncate border-b border-gray-500 py-2 px-2 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
              {node?.title}
            </h3>
            {move.node &&
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
                  onMouseEnter={(e) => {
                    setMove((prev) => ({
                      ...prev,
                      color: !(
                        (location.length > move.location?.length &&
                          move.location?.every(
                            (value, index) => value === location[index]
                          )) ||
                        move?.parent?.id === node?.id
                      )
                        ? "#19bdd6"
                        : "#ff0000",
                      translate: {
                        ...prev.translate,
                        x2: translate.x + r * 250 - 15,
                        y2: translate.y + 100,
                      },
                    }));
                  }}
                  onMouseLeave={(e) => {
                    setMove((prev) => ({
                      ...prev,
                      translate: {
                        ...prev.translate,
                        x2: prev.translate.x1,
                        y2: prev.translate.y1,
                      },
                    }));
                  }}
                  className={`w-full h-full group opacity-0 hover:opacity-100 transition-opacity duration-300  absolute top-0 left-0 bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2 ${
                    !(
                      (location.length > move.location?.length &&
                        move.location?.every(
                          (value, index) => value === location[index]
                        )) ||
                      move?.parent?.id === node?.id
                    )
                      ? "hover:cursor-pointer"
                      : "hover:cursor-not-allowed"
                  }`}
                  onClick={() => {
                    !(
                      location.length > move.location?.length &&
                      move.location?.every(
                        (value, index) => value === location[index]
                      )
                    ) && move?.parent?.id !== node?.id
                      ? handleNode("move")
                      : {};
                  }}
                >
                  {(location.length > move.location?.length &&
                    move.location?.every(
                      (value, index) => value === location[index]
                    )) ||
                  move?.parent?.id === node?.id ? (
                    <CloseIcon />
                  ) : (
                    <MovedIcon />
                  )}
                </div>
              ))}
            {deleteMenu && (
              <div className="spread absolute w-full h-full bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2">
                <div className="w-max-[250px] p-2 bg-gray-800 rounded-md h-max-[150px] flex flex-col justify-center items-center gap-2">
                  <div className="w-full flex justify-between items-center">
                    <button
                      onClick={() => handleNode("delete")}
                      title="Deleting a node will make its children become children of the node's parent."
                      className="w-full h-6 px-2 flex justify-center items-center relative text-xs bg-slate-700 py-1 rounded-sm hover:bg-red-500 transition-colors duration-300"
                    >
                      <h3 className="text-xs whitespace-nowrap w-full text-start">
                        Delete Only Node
                      </h3>
                      <div className="w-8 h-4">
                        <DeleteIcon />
                      </div>
                    </button>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <button
                      onClick={() => handleNode("deleteAll")}
                      className="w-full h-6 px-2 flex justify-between items-center relative text-xs bg-slate-700 py-1 rounded-sm hover:bg-red-500 transition-colors duration-300"
                    >
                      <h3 className="text-xs whitespace-nowrap text-start w-full">
                        Delete Node & Its Children
                      </h3>
                      <div className="w-8 h-4">
                        <DeleteIcon />
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => setDeleteMenu(false)}
                    className="w-full h-5 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-sm hover:bg-green-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="w-full flex justify-center items-center gap-2 p-2">
              <button
                className={`${
                  location.length === 0
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-cyan-600 transition-colors duration-300`}
                onClick={() => {
                  if (location.length > 0) {
                    setMove({
                      enable: true,
                      node: node,
                      parent: parent,
                      color: "#19bdd6",
                      location: location,
                      translate: {
                        x1: translate.x + r * 250 - 15,
                        y1: translate.y,
                        x2: translate.x + r * 250 - 15,
                        y2: translate.y,
                      },
                    });
                  } else {
                  }
                }}
              >
                <MoveIcon />
              </button>

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
                  onClick={() => handleExpanded(node)}
                >
                  <span
                    className={`w-full h-full ${
                      node?.expanded ? "-rotate-90" : "rotate-90"
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

              <button
                className="w-8 h-8 flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-red-500 transition-colors duration-300"
                onClick={() => setDeleteMenu(true)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      {node?.expanded &&
        node?.children?.map((child, i) => {
          return (
            <Node
              key={child.id}
              init={init}
              node={child}
              parent={node}
              t={t + 200}
              r={r}
              ptranslate={{ x: (node?.fp - r) * 250, y: t }}
              location={location.concat([i])}
            />
          );
        })}
    </>
  );
}

export default DisplayNode;
