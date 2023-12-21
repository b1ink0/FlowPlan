import React from "react";

function BackgroundIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        d="M17 2H7a5.006 5.006 0 00-5 5v10a5.006 5.006 0 005 5h10a5.006 5.006 0 005-5V7a5.006 5.006 0 00-5-5zm3 15a3 3 0 01-3 3H7a3 3 0 01-3-3v-.519l3.483-2.787a1 1 0 011.18-.05l.565.377a2.99 2.99 0 003.539-.154l2.46-1.968a1 1 0 011.332.074L20 15.414zm0-4.414l-2.027-2.027a3 3 0 00-3.995-.222l-2.461 1.969a1 1 0 01-1.18.05l-.565-.377a2.988 2.988 0 00-3.539.154L4 13.919V7a3 3 0 013-3h10a3 3 0 013 3z"
        className="fill-[var(--logo-primary)]"
      ></path>
      <circle
        cx="7"
        cy="7"
        r="1"
        className="fill-[var(--logo-primary)]"
      ></circle>
    </svg>
  );
}

export default React.memo(BackgroundIcon);
