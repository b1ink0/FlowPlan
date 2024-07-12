import { ToolTip } from "../ToolTip/index.jsx";
import React from "react";

export const Button = ({
  i,
  children,
  onClick,
  text,
  showToolTip,
  setShowToolTip,
}) => {
  return (
    <button
      onClick={onClick}
      className="shrink-0 group relative w-8 h-8 rounded-md bg-[var(--bg-tertiary)] p-[6px] flex justify-center "
      onMouseEnter={() => setShowToolTip({ show: true, index: i })}
      onMouseLeave={() => setShowToolTip({ show: false, index: null })}
    >
      {children}
      {showToolTip.show && showToolTip.index === i && <ToolTip text={text} />}
    </button>
  );
};
