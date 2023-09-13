// @ts-checkrootNodeFp
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import MovedIcon from "../../assets/Icons/MovedIcon";

function ReorderNode({
  location,
  node,
  parent,
  handleNode,
  translate,
  rootNodeFp,
  handleIfNodeIsChildOfMoveNode,
}) {
  const { move, setMove } = useStateContext();
  const [reorder, setReorder] = useState({
    w: 0,
    x: 0,
  });

  const handleReorderCalculation = () => {
    console.log("rootNodeFp", rootNodeFp);
    try {
      if (parent?.children[location[location.length - 1] + 1]) {
        let sigbling = parent.children[location[location.length - 1] + 1];
        let sigblingTranslate = {
          x: (sigbling?.fp - rootNodeFp) * 250,
        };
        let sigblingsCenter = {
          x: (sigblingTranslate.x + translate.x) / 2,
        };
        return {
          x: sigblingsCenter.x,
          w:
            Math.abs(
              sigblingTranslate.x > 0 && translate.x < 0
                ? Math.abs(sigblingTranslate.x) + Math.abs(translate.x)
                : Math.abs(sigblingTranslate.x) - Math.abs(translate.x)
            ) - 230,
        };
      }
      return {
        x: translate.x,
        w: 0,
      };
    } catch (err) {
      console.log(err);
      return {
        x: translate.x,
        w: 0,
      };
    }
  };

  const handleEnter = (x) => {
    setMove((prev) => ({
      ...prev,
      color: "#19bdd6",
      translate: {
        ...prev.translate,
        x2: x,
        y2: translate.y + 100,
      },
    }));
  };
  const handleLeave = (e) => {
    setMove((prev) => ({
      ...prev,
      translate: {
        ...prev.translate,
        x2: prev.translate.x1,
        y2: prev.translate.y1,
      },
    }));
  };

  useEffect(() => {
    setReorder(handleReorderCalculation());
  }, [move?.node]);

  // if move node is null then return null
  if (!move?.node) return null;
  // if move node is same as current node then return null
  if (move?.node?.id === node?.id) return null;
  // if move node is child or parent of current node then return null
  if (!handleIfNodeIsChildOfMoveNode()) return null;
  // parent is null then return null
  if (!parent) return null;
  // if parent has no children then return null
  if (!(parent?.children?.length > 1)) return null;

  return (
    <>
      {/* For First Child */}
      {location[location.length - 1] === 0 && (
        <Child
          type={"first"}
          x={translate.x - 125 + rootNodeFp * 250 - 15}
          width={`${20}px`}
          transform={`translate(${translate.x - 125}px, ${translate.y}px)`}
          handles={{ handleNode, handleEnter, handleLeave }}
        />
      )}

      {/* For Middle Childs */}
      {parent?.children[location[location.length - 1] + 1]?.id !==
        move?.node?.id && (
        <Child
          type={"middle"}
          x={reorder?.x + rootNodeFp * 250 - 15}
          width={`${reorder?.w}px`}
          transform={`translate(${reorder?.x}px, ${translate.y}px)`}
          handles={{ handleNode, handleEnter, handleLeave }}
        />
      )}

      {/* For Last Child */}
      {parent?.children[location[location.length - 1] + 1] === undefined && (
        <Child
          type={"last"}
          x={translate.x + 125 + rootNodeFp * 250 - 15}
          width={`${20}px`}
          transform={`translate(${translate.x + 125}px, ${translate.y}px)`}
          handles={{ handleNode, handleEnter, handleLeave }}
        />
      )}
    </>
  );
}

const Child = ({ x, width, transform, handles, type }) => {
  const { handleNode, handleEnter, handleLeave } = handles;
  return (
    <div
      className="absolute h-[100px] rounded-md border-2 border-green-600/40 overflow-hidden"
      style={{
        width: width,
        transform: transform,
      }}
    >
      <div
        className={`w-full h-full group opacity-0 hover:opacity-100 transition-opacity duration-300  absolute top-0 left-0 bg-black/80 z-10 flex flex-col justify-center items-center gap-3 p-2 hover:cursor-pointer`}
        onMouseEnter={() => handleEnter(x)}
        onMouseLeave={() => handleLeave()}
        onClick={() => handleNode("reorder", type)}
      >
        <MovedIcon />
      </div>
    </div>
  );
};

export default ReorderNode;
