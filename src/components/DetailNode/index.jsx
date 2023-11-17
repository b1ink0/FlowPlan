import React from "react";
import CloseBtnIcon from "../../assets/Icons/CloseBtnIcon";

function DetailNode({
  node,
  translate,
  showDetailNode,
  setShowDetailNode,
  treeConfig,
}) {
  const { config } = node;
  if (!showDetailNode) return null;
  return (
    <div
      style={{
        transform:
          treeConfig?.renderType === "verticalTree"
            ? `translate(${translate?.x + 315}px, ${translate?.y}px)`
            : `translate(${translate?.y + 225}px, ${translate?.x}px)`,
      }}
      className="absolute z-20 flex flex-col items-center justify-center"
    >
      <div
        className="flex flex-col items-center justify-center rounded-md w-[400px] h-fit bg-[var(--bg-secondary)] border-[3px] border-[var(--border-primary)] overflow-hidden relative"
        style={{
          backgroundColor: config?.nodeConfig?.backgroundColor,
          borderColor: config?.nodeConfig?.borderColor,
          opacity: config?.nodeConfig?.opacity / 100,
        }}
      >
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => setShowDetailNode(false)}
            className="absolute top-0 right-0 w-8 h-8 rounded-full"
          >
            <CloseBtnIcon />
          </button>
          <h1
            style={{
              borderColor: config?.nodeConfig?.borderColor,
              color: config?.titleConfig?.color,
              fontFamily: config?.titleConfig?.fontFamily,
              fontSize: config?.titleConfig?.fontSize,
              fontWeight: config?.titleConfig?.bold ? "bold" : "normal",
              fontStyle: config?.titleConfig?.italic ? "italic" : "normal",
              textDecoration: config?.titleConfig?.strickthrough
                ? "line-through"
                : "none",
            }}
            className="w-full p-2 text-center text-[var(--text-primary)] text-2xl font-bold border-b-[3px]"
          >
            {node.title}
          </h1>
          {node?.description && (
            <p className="p-2 text-[var(--text-primary)] text-lg text-center">
              {node.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailNode;
