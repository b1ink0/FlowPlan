import React from "react";

function LeftAlignIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 4h18a1 1 0 000-2H3a1 1 0 000 2zm0 6h12a1 1 0 000-2H3a1 1 0 000 2zm0 6h18a1 1 0 000-2H3a1 1 0 000 2zm0 6h12a1 1 0 000-2H3a1 1 0 000 2z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(LeftAlignIcon);
