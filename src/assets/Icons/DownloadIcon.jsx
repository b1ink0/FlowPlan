import React from "react";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 512 512"
    >
      <path
        d="M512 480c0 17.673-14.327 32-32 32H32c-17.673 0-32-14.327-32-32s14.327-32 32-32h448c17.673 0 32 14.327 32 32zM233.373 378.628c6.249 6.249 14.437 9.373 22.627 9.373 8.188 0 16.38-3.125 22.627-9.373l113.378-113.377c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L288 278.746V32c0-17.673-14.327-32-32-32s-32 14.327-32 32v246.746l-58.75-58.75c-12.497-12.497-32.758-12.497-45.255 0s-12.497 32.758 0 45.255z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(Icon);
