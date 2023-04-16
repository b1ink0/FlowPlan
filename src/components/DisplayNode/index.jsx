import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";

const DisplayNode = ({
  update,
  setUpdate,
  location,
  left,
  right,
  parentRef,
  containerRef,
  containerParentRef,
  parentPosition,
  paths,
  setPaths,
  parentIsExpanded,
}) => {
  const { currentTreeNote, setAddEditNode } = useStateContext();
  const [node, setNode] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({
    left: "0px",
    top: "0px",
  });
  const nodeRef = useRef(null);
  const currentParentRef = useRef(null);

  const handleAddNode = () => {
    setAddEditNode({
      show: true,
      location: location,
      type: "add",
    });
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
    console.log(parentIsExpanded);
    console.log("location", location);
    let currentNode = currentTreeNote.root;
    console.log(location);
    if (location.length === 0) {
      setNode(currentNode);
      setTimeout(() => {
        getDistanceBetweenDivs(
          parentRef,
          nodeRef,
          containerRef,
          currentNode.id
        );
      }, 0);
      return;
    }
    location.forEach((loc, i) => {
      if (i === location.length - 1) {
        setNode(currentNode?.children[loc]);
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
    return console.log("unmount");
    // console.log(parentRef, nodeRef);
  }, []);

  useEffect(() => {
    // console.log(currentTreeNote);
  }, [currentTreeNote]);

  useEffect(() => {
    console.log("update", update);
    setTimeout(() => {
      getDistanceBetweenDivs(parentRef, nodeRef, containerRef, node?.id);
    }, 0);
  }, [update, parentPosition, currentTreeNote]);

  useEffect(() => {
    console.log(parentPosition, position);
  }, [position]);

  useEffect(() => {
    if (!isExpanded) {
      console.log("collapsed");
    }
  }, [isExpanded]);

  return (
    <div className="spread border-gray-300 flex flex-col justify-start items-center pt-28">
      <div
        ref={currentParentRef}
        className={`${
          isExpanded ? "cursor-default" : "cursor-pointer"
        } w-fit flex flex-col justify-center items-center border-2 border-gray-700 bg-gray-800 p-2 text-gray-200 rounded-md gap-1`}
      >
        <span
          style={{ top: position.top + "px", left: position.left + "px" }}
          className="absolute block w-0 h-0 bg-red-500"
        ></span>
        <span ref={nodeRef} className="absolute w-0 h-0 bg-red-400"></span>
        <h3>{node?.title}</h3>
        <p>{node?.description}</p>
        <div dangerouslySetInnerHTML={{ __html: node?.html }} />
        <button
          className="text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-slate-800 transition-colors duration-300"
          onClick={() => {
            setIsExpanded(!isExpanded);
            setUpdate(update + 1);
          }}
        >
          {isExpanded ? "Collapse Child" : "Expand Child"}
        </button>
        <button
          className="text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-slate-800 transition-colors duration-300"
          onClick={handleAddNode}
        >
          Add Child Node
        </button>
      </div>
      <div className="flex gap-10">
        {isExpanded &&
          node?.children.map((child, i) => (
            <DisplayNode
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
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayNode;