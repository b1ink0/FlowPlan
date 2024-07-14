import React from "react";

export const ToolTip = ({ text }) => {
  return (
    <div className="z-10 flex justify-center items-center absolute -bottom-8 text-center whitespace-nowrap w-fit h-6 bg-[var(--bg-tertiary)] rounded-md px-2">
      <span className="absolute inline-block -top-1 w-3 h-3 rotate-45 bg-[var(--bg-tertiary)] -z-10"></span>
      <span className="text-xs">{text}</span>
    </div>
  );
};
