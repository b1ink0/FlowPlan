import React from "react";

function DotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0 fill-current"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 20a8 8 0 100-16 8 8 0 000 16z"
        className="fill-current"
      ></path>
    </svg>
  );
}

export default React.memo(DotIcon);
