import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import BackIcon from "../../assets/Icons/BackIcon";
import EditBtnIcon from "../../assets/Icons/EditBtnIcon";
import { traverseTree } from "../../hooks/useTree";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import MoveIcon from "../../assets/Icons/MoveIcon";
import { useFunctions } from "../../hooks/useFunctions";

const DisplayNode = ({
  update,
  setUpdate,
  location,
  parentRef,
  containerRef,
  containerParentRef,
  parentPosition,
  paths,
  setPaths,
  parentCurrentRef,
  currentIsExpanded,
  setParentIsExpanded,
}) => {
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
  const [node, setNode] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
  });
  const [showAll, setShowAll] = useState(false);
  const nodeRef = useRef(null);
  const currentRef = useRef(null);
  const currentParentRef = useRef(null);
  const [deleteMenu, setDeleteMenu] = useState(false);

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
        handleDeleteNodeWithoutItsChildren(
          node,
          setParentIsExpanded,
          location[location.length - 1],
          setPaths
        );
        break;
      case "deleteAll":
        handleDeleteNodeWithItsChildren(
          node,
          setParentIsExpanded,
          location[location.length - 1],
          setPaths
        );
      case "move":
        handleMoveNode(node);
        break;
      default:
        break;
    }
  };

  const getDistanceBetweenDivs = (parentRef, nodeRef, containerRef, id) => {
    if (!containerRef || !nodeRef || !currentParentRef) return 0;

    let nestedElm = nodeRef.current;
    let parentElm = containerRef.current;
    let offsetLeft = nestedElm.offsetLeft;
    let offsetTop = nestedElm.offsetTop;

    while (
      nestedElm.offsetParent !== parentElm &&
      nestedElm.offsetParent !== null
    ) {
      nestedElm = nestedElm.offsetParent;
      offsetLeft += nestedElm.offsetLeft;
      offsetTop += nestedElm.offsetTop;
    }

    setPosition({
      left: offsetLeft,
      top: offsetTop,
    });
    if (parentPosition === undefined) return;
    if (id === undefined) return;
    console.log("parentPosition", parentPosition);
    const p1x = parentPosition.left;
    const p1y =
      parentPosition.top + containerParentRef.current.offsetHeight / 2;
    const p2x = offsetLeft;
    const p2y = offsetTop - currentParentRef.current.offsetHeight / 2;
    console.log(
      currentParentRef.current.offsetWidth,
      containerParentRef.current.offsetWidth
    );

    const mpx = (p1x + p2x) / 2;
    const mpy = (p1y + p2y) / 2;
    // const mpx = p1x ;
    // const mpy = p1y ;

    const theta = Math.atan2(p2y - p1y, p2x - p1x) - Math.PI / 2;
    const offsetX = -30;
    const offsetY = 50;

    const c1x = mpx + offsetX * Math.cos(theta);
    const c1y = mpy + offsetY * Math.sin(theta);

    const path = {
      id: id,
      path: `M${p1x} ${p1y} C ${p1x} ${p2y - offsetY}, ${p2x} ${
        p1y + 30
      }, ${p2x} ${p2y}`,
    };

    console.log(path);

    setPaths((prev) => {
      const indexToReplace = prev.findIndex((path) => path.id === id);
      if (indexToReplace === -1) return [...prev, path];
      const newPaths = [...prev];
      newPaths[indexToReplace] = path;
      return newPaths;
    });
    console.log(offsetLeft, offsetTop, location.toString(), id);
  };

  useEffect(() => {
    let currentNode = currentTreeNote.root;
    if (!currentNode) return;
    if (location.length === 0) {
      setNode(currentNode);
      if (!currentExpanded[currentNode.id]) return;
      setIsExpanded(currentExpanded[currentNode.id]);
      setTimeout(() => {
        getDistanceBetweenDivs(
          parentRef,
          nodeRef,
          containerRef,
          currentNode.id
        );
      }, 200);
      return;
    }
    location.forEach((loc, i) => {
      if (i === location.length - 1) {
        if (!currentNode?.children[loc]) return;
        setNode(currentNode?.children[loc]);
        setIsExpanded(currentExpanded[currentNode?.children[loc].id] || false);
        setTimeout(() => {
          getDistanceBetweenDivs(
            parentRef,
            nodeRef,
            containerRef,
            currentNode?.children[loc].id
          );
        }, 0);
        console.log(currentNode?.children[loc]);
      } else {
        currentNode = currentNode?.children[loc];
      }
    });
    return () => {
      setPaths((prev) => {
        let node = currentTreeNote.root;
        let currentNode = currentTreeNote.root;
        location.forEach((loc, i) => {
          if (i === location.length - 1) {
            node = currentNode?.children[loc];
          } else {
            currentNode = currentNode?.children[loc];
          }
        });
        console.log("unmout", node, prev);
        const indexToReplace = prev.findIndex((path) => path.id === node?.id);
        if (indexToReplace === -1) return prev;
        const newPaths = [...prev];
        newPaths.splice(indexToReplace, 1);
        console.log("unmout", newPaths.length, prev.length);
        return newPaths;
      });
    };
    // console.log(parentRef, nodeRef);
  }, [currentTreeNote.root]);

  useEffect(() => {
    console.log("update", update);
    setTimeout(() => {
      getDistanceBetweenDivs(parentRef, nodeRef, containerRef, node?.id);
    }, 0);
    let node = currentTreeNote.root;
    let currentNode = currentTreeNote.root;
    location.forEach((loc, i) => {
      if (i === location.length - 1) {
        node = currentNode?.children[loc];
      } else {
        currentNode = currentNode?.children[loc];
      }
    });
    console.log("updateupdate", currentNode?.id === node?.id);
  }, [update, parentPosition, currentTreeNote]);

  return (
    <div
      ref={currentRef}
      className={`flex flex-col justify-start items-center pt-28`}
    >
      <div
        ref={currentParentRef}
        className={`${
          isExpanded ? "cursor-default" : "cursor-pointer"
        } spread scale-0 ${
          showAll ? "w-fit max-w-[500px]" : "w-[270px]"
        } overflow-hidden  min-w-[270px] min-h-[150px] flex flex-col justify-center items-center border-2 border-gray-700 bg-gray-800 text-gray-200 rounded-md gap-1`}
      >
        <span
          style={{ top: position.top + "px", left: position.left + "px" }}
          className="absolute block w-0 h-0 bg-red-500"
        ></span>
        <span ref={nodeRef} className="absolute w-0 h-0 bg-red-400"></span>
        <div className="w-full h-full flex flex-col justify-between items-center">
          <h3
            onClick={() => {
              setShowAll((showAll) => !showAll);
              setUpdate(update + 1);
            }}
            className="w-full text-center text-2xl truncate border-b border-gray-500 py-2 px-2 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
          >
            {node?.title}
          </h3>
          {node?.description !== "" && (
            <p className="w-full text-center p-2 truncate">
              {node?.description}
            </p>
          )}
          <div dangerouslySetInnerHTML={{ __html: node?.html }} />
          {move.node &&
            (move.node.id === node.id ? (
              <div className="w-full h-full absolute top-0 left-0 bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2">
                <div className="w-max-[250px] p-2 bg-gray-800 rounded-md h-max-[150px] flex flex-col justify-center items-center gap-3">
                  <div className="w-full flex flex-col justify-between items-center gap-2">
                    <div className="w-full h-fit px-2 flex justify-center items-center relative text-xs bg-slate-700 py-1 rounded-md transition-colors duration-300">
                      <h3 className="text-sm w-full text-start">
                        Click on the node you want to move this node to
                      </h3>
                    </div>
                    <button
                      onClick={() => setMove({ enable: false, node: null })}
                      className="w-full h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-green-700 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-300  absolute top-0 left-0 bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2">
                <button
                  onClick={() => handleNode("move")}
                  className="w-fit h-8 px-2 flex justify-center items-center relative text-xs bg-slate-700 py-1 rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  Move Node
                </button>
              </div>
            ))}
          {deleteMenu && (
            <div className="spread absolute w-full h-full bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2">
              <div className="w-max-[250px] p-2 bg-gray-800 rounded-md h-max-[150px] flex flex-col justify-center items-center gap-3">
                <div className="w-full flex justify-between items-center">
                  <button
                    onClick={() => handleNode("delete")}
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
                    onClick={() => handleNode("deleteAll")}
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
          )}
          <div className="w-full flex justify-center items-center gap-2 p-2">
            {showAll && (
              <button
                className="w-8 h-8 group flex justify-center items-center relative text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-cyan-600 transition-colors duration-300"
                onClick={() => setMove({ enable: true, node })}
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
                onClick={async () => {
                  setIsExpanded(!isExpanded);
                  setUpdate(update + 1);
                  const newPrev = {
                    ...currentExpanded,
                    [node?.id]: !isExpanded,
                  };
                  await db.treeNotesExpanded
                    .where("refId")
                    .equals(currentTreeNote.refId)
                    .modify((expanded) => {
                      expanded.expanded = newPrev;
                    });
                }}
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
      <div className="flex gap-10">
        {isExpanded &&
          node?.children.map((child, i) => (
            <DisplayNode
              display={isExpanded}
              key={i}
              location={location.concat([i])}
              left={i === 0}
              right={node?.children.length - 1 === i}
              parentRef={nodeRef}
              containerParentRef={currentParentRef}
              update={update}
              setUpdate={setUpdate}
              containerRef={containerRef}
              parentPosition={position}
              paths={paths}
              setPaths={setPaths}
              parentIsExpanded={isExpanded}
              setParentIsExpanded={setIsExpanded}
              parentCurrentRef={currentRef}
              currentIsExpanded={currentExpanded[child.id]}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayNode;
