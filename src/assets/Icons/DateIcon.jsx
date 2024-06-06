import React from "react";

function DateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 32 32"
    >
      <path
        d="M26.79 4.25h-3.52v-.5a1 1 0 00-2 0v.5H10.73v-.5a1 1 0 00-2 0v.5H5.21A4.22 4.22 0 001 8.46V26a4.22 4.22 0 004.21 4.21h21.58A4.22 4.22 0 0031 26V8.46a4.22 4.22 0 00-4.21-4.21zm-21.58 2h3.52v.5a1 1 0 002 0v-.5h10.54v.5a1 1 0 002 0v-.5h3.52A2.21 2.21 0 0129 8.46v2.37H3V8.46a2.21 2.21 0 012.21-2.21zm21.58 22H5.21A2.21 2.21 0 013 26V12.83h26V26a2.21 2.21 0 01-2.21 2.25z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(DateIcon);
