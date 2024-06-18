import React from "react";

function TopBarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 47.582 47.582"
      className="h-full w-full  shrink-0"
    >
      <path
        d="M0 18.791v10h47.582v-10H0zm45.582 8H2v-6h43.582v6z"
        className="fill-[var(--logo-primary)]"
      ></path>
      <path
        d="M3.581 21.988h29.417v3.605H3.581z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(TopBarIcon);
