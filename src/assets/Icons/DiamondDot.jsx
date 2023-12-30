import React from "react";

function DiamondDot() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 512 512"
    >
      <path
        d="M256 0L59.83 256 256 512l196.17-256z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(DiamondDot);
