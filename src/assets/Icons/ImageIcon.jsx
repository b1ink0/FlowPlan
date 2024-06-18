import React from "react";

function ImageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        d="M21.75 11v6A3.383 3.383 0 0118 20.75H6A3.383 3.383 0 012.25 17V7A3.383 3.383 0 016 3.25h7a.75.75 0 010 1.5H6c-1.577 0-2.25.673-2.25 2.25v9.25l2.54-2.54a1.008 1.008 0 011.42 0l.94.94a.5.5 0 00.7 0l4.94-4.94a1.008 1.008 0 011.42 0l4.54 4.54V11a.75.75 0 011.5 0zM7.993 7.75a1.253 1.253 0 10.007 0zm9.007-2h1.25V7a.75.75 0 001.5 0V5.75H21a.75.75 0 000-1.5h-1.25V3a.75.75 0 00-1.5 0v1.25H17a.75.75 0 000 1.5z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(ImageIcon);
