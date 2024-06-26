import React from "react";

function CodeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        d="M1.293 12.707l4 4a1 1 0 101.414-1.414L3.414 12l3.293-3.293a1 1 0 10-1.414-1.414l-4 4a1 1 0 000 1.414zm17.414-5.414a1 1 0 10-1.414 1.414L20.586 12l-3.293 3.293a1 1 0 101.414 1.414l4-4a1 1 0 000-1.414zm-5.668-2.567l-4 14a1 1 0 00.686 1.236A1.053 1.053 0 0010 20a1 1 0 00.961-.726l4-14a1 1 0 10-1.922-.548z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(CodeIcon);
