import React from "react";

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 512 512"
    >
      <path
        d="M328.265 512c-20.834 0-39.375-13.986-45.097-34.011L227.8 284.2 34.011 228.832C13.985 223.11 0 204.569 0 183.743c0-21.119 13.586-39.379 33.808-45.446L492.689.633a15.002 15.002 0 0118.678 18.678L373.702 478.193C367.636 498.414 349.376 512 328.265 512z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(ShareIcon);