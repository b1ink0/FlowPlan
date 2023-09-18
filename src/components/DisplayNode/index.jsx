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
  // destructure state from context
  const { animation } = useStateContext();
  // local state
  // init is used to stop animate the first time the tree is loaded
  // this is done to prevent the animation from running when the tree is loaded
  // here animation is used to disable the animation all the time
  const [init, setInit] = useState(animation ? true : false);
  // useEffect to stop animation after 1 second
  useEffect(() => {
    // if animation is false then return so animation remains stopped
    if (!animation) return;
    // else set init to false after 1 second so animation happens after 1 second
    setTimeout(() => {
      setInit(false);
    }, 1000);
  }, []);

  return (
    // Wrapper div for the whole tree
    <div className="w-0 h-0 relative flex justify-center items-start">
      <Node
        init={init}
        node={node}
        yTranslateMargin={0}
        rootNodeFp={node?.fp}
        location={[]}
        ptranslate={{ x: 0, y: 0 }}
      />
    </div>
  );
}

function Node({
  node,
  yTranslateMargin,
  rootNodeFp,
  location,
  ptranslate,
  init,
  parent = null,
}) {
  // destructure state from context
  const { settings, setAddEditNode, move, setMove, update, animation } =
    useStateContext();

  // destructure node config from settings
  const { nodeConfig } = settings;

  // destructure functions from custom hook
  const {
    handleDeleteNodeWithoutItsChildren,
    handleDeleteNodeWithItsChildren,
    handleMoveNode,
    handleReorderNode,
    handleExpanded,
  } = useFunctions();

  // local state
  const [deleteMenu, setDeleteMenu] = useState(false);

  // for init animation
  // here first translate is calculated so that the node is placed at the same position as of its parent
  const handleInitTranslate = () => {
    // init translate
    let x = 0,
      y = 0;
    // if animation is disabled or init is true then set x and y to the calculated value
    if (!animation || init) {
      x = (node?.fp - rootNodeFp) * nodeConfig.nodeWidthMargin;
      y = yTranslateMargin;
    }
    // else set x and y to the parent translate value
    else {
      x = ptranslate?.x || 0;
      y = ptranslate?.y + nodeConfig.nodeHeightMargin || 0;
    }
    return { x, y };
  };

  // initlize translate
  const [translate, setTranslate] = useState(handleInitTranslate());

  // useEffect to update translate when tree is updated
  useEffect(() => {
    setTranslate({
      x: (node?.fp - rootNodeFp) * nodeConfig.nodeWidthMargin,
      y: yTranslateMargin,
    });
  }, [update]);

  // function to handle node actions
  const handleNode = (type, data) => {
    // type defines the action to be taken
    switch (type) {
      // if type is add then set addEditNode state to show addEditNode component for adding node
      case "add":
        setAddEditNode({
          show: true,
          location: location,
          type: type,
        });
        break;
      // if type is edit then set addEditNode state to show addEditNode component for editing node
      case "edit":
        setAddEditNode({
          show: true,
          location: location,
          type: type,
        });
        break;
      // if type is delete then delete node without its children its children become children of the node's parent
      case "delete":
        handleDeleteNodeWithoutItsChildren(
          parent,
          node,
          location[location.length - 1]
        );
        break;
      // if type is deleteAll then delete node with its children
      case "deleteAll":
        handleDeleteNodeWithItsChildren(parent, node);
      // if type is move then handle move node
      case "move":
        handleMoveNode(node);
        break;
      // if type is reorder then handle reorder node
      case "reorder":
        handleReorderNode(parent, data, location[location.length - 1]);
        break;
      default:
        console.log("provide a valid type");
        break;
    }
  };

  // function to check if two arrays are equal
  // [1,2,3] === [1,2,3] => true
  // [1,2,3] === [1,2,3,4] => true
  // [1,2,3] === [1,2,4] => false
  const handleAreArraysEqual = (arr1, arr2) => {
    // if any of the array is null or empty then return false
    if (!arr1?.length || !arr2?.length) return false;
    // else return true if all the values of the array are equal
    return arr1.every((value, index) => value === arr2[index]);
  };

  // function to check if current node is a child of the move node
  const handleIfNodeIsChildOfMoveNode = () => {
    // if current node is on lower level than the move node then return false
    if (
      location?.length > move?.location?.length &&
      // and if current node on lower level than the move node
      // then check if current node is a child of the move node
      handleAreArraysEqual(move?.location, location)
    )
      return false;
    // else return true
    return true;
  };

  // function to check if current node is a parent of the move node
  const handleIfNodeIsParentOfMoveNode = () => {
    // if current node is on higher level than the move node then return false
    if (
      !handleIfNodeIsChildOfMoveNode() ||
      // and if current node on higher level than the move node
      // then check if current node is a parent of the move node
      move?.parent?.id === node?.id
    )
      return true;
    // else return true
    return false;
  };

  return (
    <>
      {/* Reorder Helper */}
      <ReorderNode
        handleNode={handleNode}
        translate={translate}
        rootNodeFp={rootNodeFp}
        location={location}
        node={node}
        parent={parent}
        key={"reorder-" + node.id}
        handleIfNodeIsChildOfMoveNode={handleIfNodeIsChildOfMoveNode}
      />

      {/* Node Component */}
      <div
        className="absolute duration-500"
        style={{
          // translate node to its position
          transform: `translate(${translate.x}px,  ${translate.y}px)`,
          // disable animation if animation is disabled
          transition: animation ? "transform 0.5s ease-in-out" : "none",
        }}
      >
        <div
          className={`spread scale-0 ${
            // if move is enabled and move node is not null
            move?.node &&
            // check if node alloed to move to current node
            (handleIfNodeIsParentOfMoveNode()
              ? "neon-red-border"
              : "neon-border")
          } overflow-hidden flex flex-col justify-between items-center border-2 border-gray-700 bg-gray-800 text-gray-200 rounded-md gap-1`}
          // set node width and height from settings
          style={{
            width: nodeConfig.nodeWidth + "px",
            height: nodeConfig.nodeHeight + "px",
          }}
        >
          {/* Node Body */}
          <div className="w-full h-full flex flex-col justify-between items-center">
            {/* Node Title */}
            <h3 className="w-full text-center text-2xl truncate border-b border-gray-500 py-2 px-2 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
              {node?.title}
            </h3>
            {/* Move Node Overlay When Moving Node */}
            {move.node && (
              <MoveNodeOverlay
                translate={translate}
                move={move}
                setMove={setMove}
                node={node}
                handleNode={handleNode}
                nodeConfig={nodeConfig}
                rootNodeFp={rootNodeFp}
                handleIfNodeIsParentOfMoveNode={handleIfNodeIsParentOfMoveNode}
              />
            )}
            {/* Delete Menu*/}
            {deleteMenu && (
              <DeleteMenu
                handleNode={handleNode}
                setDeleteMenu={setDeleteMenu}
              />
            )}
            {/* Node Buttons */}
            <ButtonsWrapper
              handleExpanded={handleExpanded}
              handleNode={handleNode}
              location={location}
              node={node}
              parent={parent}
              nodeConfig={nodeConfig}
              rootNodeFp={rootNodeFp}
              setDeleteMenu={setDeleteMenu}
              setMove={setMove}
              translate={translate}
            />
          </div>
        </div>
      </div>

      {/* Childrens */}
      {
        // check if node is expanded and has children
        node?.expanded &&
          // check if node has children
          node?.children?.map((child, i) => {
            return (
              // recursively call Node component for each child
              <Node
                key={child.id}
                init={init}
                node={child}
                parent={node}
                yTranslateMargin={
                  yTranslateMargin + nodeConfig.nodeHeightMargin * 2
                }
                rootNodeFp={rootNodeFp}
                ptranslate={{
                  x: (node?.fp - rootNodeFp) * nodeConfig.nodeWidthMargin,
                  y: yTranslateMargin,
                }}
                location={location.concat([i])}
              />
            );
          })
      }
    </>
  );
}

// Move Node Overlay
const MoveNodeOverlay = ({
  translate,
  move,
  setMove,
  node,
  handleNode,
  nodeConfig,
  rootNodeFp,
  handleIfNodeIsParentOfMoveNode,
}) => {
  // function to reset move node
  const handleResetMove = () => {
    setMove({
      enable: false,
      node: null,
    });
  };

  // function to handle enter event to node
  const handleOnEnter = () => {
    // initlize variables
    let color, x2, y2;
    // set color and translate according to the node
    color = handleIfNodeIsParentOfMoveNode() ? "#ff0000" : "#19bdd6";
    // x coordinate of the node for live path
    x2 =
      translate.x +
      rootNodeFp * nodeConfig.nodeWidthMargin -
      (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth) / 2;
    // y coordinate of the node for live path
    y2 = translate.y + nodeConfig.nodeHeightMargin;
    // set move state
    setMove({
      ...move,
      color: color,
      translate: {
        ...move.translate,
        x2: x2,
        y2: y2,
      },
    });
  };

  // function to handle leave event to node
  const handleOnLeave = () => {
    // set move state
    let translate = {
      ...move.translate,
      x2: move.translate.x1,
      y2: move.translate.y1,
    };
    setMove({
      ...move,
      translate: translate,
    });
  };

  const handleMoveNode = () => {
    // if current node is a child or parent of the move node then return
    if (handleIfNodeIsParentOfMoveNode()) return;
    // else move node
    handleNode("move");
  };

  return (
    <>
      {/* if move node is equal to the current node then show close button */}
      {move.node.id === node.id ? (
        <div
          onClick={handleResetMove}
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
        // else show move button
        <div
          onMouseEnter={handleOnEnter}
          onMouseLeave={handleOnLeave}
          className={`w-full h-full group opacity-0 hover:opacity-100 transition-opacity duration-300  absolute top-0 left-0 bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2 ${
            handleIfNodeIsParentOfMoveNode()
              ? "hover:cursor-not-allowed"
              : "hover:cursor-pointer"
          }`}
          onClick={handleMoveNode}
        >
          {/* if current node is a child or parent of the move node then show not allowed icon */}
          {handleIfNodeIsParentOfMoveNode() ? <CloseIcon /> : <MovedIcon />}
        </div>
      )}
    </>
  );
};

// Delete Menu
const DeleteMenu = ({ handleNode, setDeleteMenu }) => {
  return (
    <div className="spread absolute w-full h-full bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2">
      <div className="w-max-[250px] p-2 bg-gray-800 rounded-md h-max-[150px] flex flex-col justify-center items-center gap-2">
        {/* This button will delete the node without its children */}
        <div className="w-full flex justify-between items-center">
          <button
            // delete node without its children
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
        {/* This button will delete the node with its children */}
        <div className="w-full flex justify-between items-center">
          <button
            // delete node with its children
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
        {/* This button will cancel the delete menu */}
        <button
          onClick={() => setDeleteMenu(false)}
          className="w-full h-5 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-sm hover:bg-green-700 transition-colors duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Buttons For Node Component
const ButtonsWrapper = ({
  location,
  setMove,
  node,
  parent,
  translate,
  nodeConfig,
  rootNodeFp,
  handleNode,
  handleExpanded,
  setDeleteMenu,
}) => {
  // function to handle move node
  const handleInitMove = () => {
    // if location is empty then return because it mean its a root node
    if (location.length === 0) return;
    // else set move state
    let tempTranslate = {
      x1:
        translate.x +
        rootNodeFp * nodeConfig.nodeWidthMargin -
        (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth) / 2,
      y1: translate.y,
      x2:
        translate.x +
        rootNodeFp * nodeConfig.nodeWidthMargin -
        (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth) / 2,
      y2: translate.y,
    };

    setMove({
      enable: true,
      node: node,
      parent: parent,
      color: "#19bdd6",
      location: location,
      translate: tempTranslate,
    });
  };

  return (
    // Buttons Wrapper
    <div className="w-full flex justify-center items-center gap-2 p-2">
      {/* Move Node Button */}
      <button
        className={`${
          location.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
        } w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-cyan-600 transition-colors duration-300`}
        onClick={handleInitMove}
      >
        <MoveIcon />
      </button>
      {/* Add Node Button */}
      <button
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-purple-600 transition-colors duration-300"
        onClick={() => handleNode("add")}
      >
        <span className="absolute group-hover:rotate-90 transition-all duration-300 block w-[3px] rounded-md h-4 bg-gray-200"></span>
        <span className="absolute group-hover:rotate-90 transition-all duration-300 block w-4 rounded-md h-[3px] bg-gray-200"></span>
      </button>
      {/* Expand Node Button */}
      {
        // check if node has children
        node?.children?.length > 0 && (
          //  then show expand node button
          <button
            className="w-8 h-8 group text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            onClick={() => handleExpanded(node)}
          >
            <span
              className={`w-full h-full ${
                // if node is expanded then rotate the button
                node?.expanded ? "-rotate-90" : "rotate-90"
              } flex justify-center items-center transition-all duration-300 transform group-hover:scale-125`}
            >
              <BackIcon />
            </span>
          </button>
        )
      }
      {/* Edit Node Button */}
      <button
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-green-700 transition-colors duration-300"
        onClick={() => handleNode("edit")}
      >
        <EditBtnIcon />
      </button>
      {/* Delete Node Button */}
      <button
        className="w-8 h-8 flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-red-500 transition-colors duration-300"
        onClick={() => setDeleteMenu(true)}
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

export default DisplayNode;
