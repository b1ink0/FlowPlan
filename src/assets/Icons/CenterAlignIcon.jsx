import React from "react";

function CenterAlignIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 72 72"
    >
      <path
        d="M63 15H9c-1.7 0-3-1.3-3-3s1.3-3 3-3h54c1.7 0 3 1.3 3 3s-1.3 3-3 3zm-9 16H18c-1.7 0-3-1.3-3-3s1.3-3 3-3h36c1.7 0 3 1.3 3 3s-1.3 3-3 3zm9 16H9c-1.7 0-3-1.3-3-3s1.3-3 3-3h54c1.7 0 3 1.3 3 3s-1.3 3-3 3zm-9 16H18c-1.7 0-3-1.3-3-3s1.3-3 3-3h36c1.7 0 3 1.3 3 3s-1.3 3-3 3z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(CenterAlignIcon);
