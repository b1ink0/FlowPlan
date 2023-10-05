import React from "react";

function ColorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 384 384"
    >
      <path
        d="M192 0C85.973 0 0 85.973 0 192s85.973 192 192 192c17.707 0 32-14.293 32-32 0-8.32-3.093-15.787-8.32-21.44-5.013-5.653-8-13.013-8-21.227 0-17.707 14.293-32 32-32h37.653c58.88 0 106.667-47.787 106.667-106.667C384 76.373 298.027 0 192 0zM74.667 192c-17.707 0-32-14.293-32-32s14.293-32 32-32 32 14.293 32 32-14.294 32-32 32zm64-85.333c-17.707 0-32-14.293-32-32s14.293-32 32-32 32 14.293 32 32-14.294 32-32 32zm106.666 0c-17.707 0-32-14.293-32-32s14.293-32 32-32 32 14.293 32 32-14.293 32-32 32zm64 85.333c-17.707 0-32-14.293-32-32s14.293-32 32-32 32 14.293 32 32-14.293 32-32 32z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(ColorIcon);
