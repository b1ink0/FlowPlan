import React from "react";

function GraphIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 32 32"
    >
      <rect
        width="8"
        height="12"
        x="2"
        y="18"
        className="fill-[var(--logo-primary)]"
        rx="1"
      ></rect>
      <rect
        width="8"
        height="20"
        x="22"
        y="10"
        className="fill-[var(--logo-primary)]"
        rx="1"
      ></rect>
      <rect
        width="8"
        height="28"
        x="12"
        y="2"
        className="fill-[var(--logo-primary)]"
        rx="1"
      ></rect>
    </svg>
  );
}

export default React.memo(GraphIcon);
