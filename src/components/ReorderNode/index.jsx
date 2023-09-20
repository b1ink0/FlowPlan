// @ts-checkrootNodeFp
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import MovedIcon from "../../assets/Icons/MovedIcon";

function ReorderNode({
  location,
  node,
  parent,
  handleNode,
  ptranslate,
  translate,
  rootNodeFp,
  handleIfNodeIsChildOfMoveNode,
}) {
  const { move, setMove, settings } = useStateContext();
  const { treeConfig, nodeConfig } = settings;
  const [reorder, setReorder] = useState({
    w: 0,
    x: 0,
  });

  const handleReorderCalculation = () => {
    try {
      if (parent?.children[location[location.length - 1] + 1]) {
        let sigbling = parent.children[location[location.length - 1] + 1];
        let sigblingTranslate = {
          x:
            (sigbling?.fp - rootNodeFp) *
            (treeConfig.renderType === "verticalTree"
              ? settings.nodeConfig.nodeWidthMargin
              : settings.nodeConfig.nodeHeightMargin),
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
            ) -
            (treeConfig.renderType === "verticalTree"
              ? settings.nodeConfig.nodeWidthMargin - 20
              : settings.nodeConfig.nodeHeightMargin - 20),
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
      color: "var(--live-path-primary)",
      rootNodeFp: rootNodeFp,
      translate: {
        ...prev.translate,
        x2: x,
        y2:
          treeConfig.renderType === "verticalTree"
            ? translate.y + nodeConfig.nodeHeight
            : translate.y + nodeConfig.nodeWidth,
        x3: ptranslate.x,
        y3: ptranslate.y,
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
        x3: null,
        y3: null,
      },
    }));
  };

  useEffect(() => {
    if (move?.node) setReorder(handleReorderCalculation());
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
          x={
            treeConfig.renderType === "verticalTree"
              ? translate.x -
                125 +
                rootNodeFp * nodeConfig.nodeWidthMargin -
                (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth) / 2
              : translate.x -
                125 +
                rootNodeFp * nodeConfig.nodeHeightMargin +
                ((nodeConfig.nodeHeightMargin - nodeConfig.nodeHeight) / 2) * 3
          }
          height={
            treeConfig.renderType === "verticalTree"
              ? `${nodeConfig.nodeHeight}px`
              : `${20}px`
          }
          width={
            treeConfig.renderType === "verticalTree"
              ? `${20}px`
              : `${nodeConfig.nodeWidth}px`
          }
          transform={
            treeConfig.renderType === "verticalTree"
              ? `translate(${translate.x - 125}px, ${translate.y}px)`
              : `translate(${translate.y}px, ${translate.x - 65}px)`
          }
          handles={{ handleNode, handleEnter, handleLeave }}
        />
      )}

      {/* For Middle Childs */}
      {parent?.children[location[location.length - 1] + 1]?.id !==
        move?.node?.id && (
        <Child
          type={"middle"}
          x={
            treeConfig.renderType === "verticalTree"
              ? reorder?.x +
                rootNodeFp * nodeConfig.nodeWidthMargin -
                (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth) / 2
              : reorder?.x +
                rootNodeFp * nodeConfig.nodeHeightMargin -
                (nodeConfig.nodeHeightMargin - nodeConfig.nodeHeight) / 2
          }
          height={
            treeConfig.renderType === "verticalTree"
              ? `${nodeConfig.nodeHeight}px`
              : `${reorder?.w}px`
          }
          width={
            treeConfig.renderType === "verticalTree"
              ? `${reorder?.w}px`
              : `${nodeConfig.nodeWidth}px`
          }
          transform={
            treeConfig.renderType === "verticalTree"
              ? `translate(${reorder?.x}px, ${translate.y}px)`
              : `translate(${translate.y}px, ${reorder?.x}px)`
          }
          handles={{ handleNode, handleEnter, handleLeave }}
        />
      )}

      {/* For Last Child */}
      {parent?.children[location[location.length - 1] + 1] === undefined && (
        <Child
          type={"last"}
          x={
            treeConfig.renderType === "verticalTree"
              ? translate.x +
                125 +
                rootNodeFp * nodeConfig.nodeWidthMargin -
                (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth) / 2
              : translate.x +
                125 +
                rootNodeFp * nodeConfig.nodeHeightMargin -
                ((nodeConfig.nodeHeightMargin - nodeConfig.nodeHeight) / 2) * 5
          }
          height={
            treeConfig.renderType === "verticalTree"
              ? `${nodeConfig.nodeHeight}px`
              : `${20}px`
          }
          width={
            treeConfig.renderType === "verticalTree"
              ? `${20}px`
              : `${nodeConfig.nodeWidth}px`
          }
          transform={
            treeConfig.renderType === "verticalTree"
              ? `translate(${translate.x + 125}px, ${translate.y}px)`
              : `translate(${translate.y}px, ${translate.x + 65}px)`
          }
          handles={{ handleNode, handleEnter, handleLeave }}
        />
      )}
    </>
  );
}

const Child = ({ x, width, height, transform, handles, type }) => {
  const { handleNode, handleEnter, handleLeave } = handles;
  return (
    <div
      className="absolute rounded-md border-2 border-[var(--border-secondary)] overflow-hidden"
      style={{
        width: width,
        height: height,
        transform: transform,
      }}
    >
      <div
        className={`w-full h-full group opacity-0 hover:opacity-100 transition-opacity duration-300  absolute top-0 left-0 bg-[var(--bg-primary-translucent)] z-10 flex flex-col justify-center items-center gap-3 p-2 hover:cursor-pointer`}
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
