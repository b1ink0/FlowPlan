import React from "react";

function MoveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 32 32"
    >
      <g fillRule="evenodd" clipRule="evenodd">
        <path
          d="M11.402 24.402a1.5 1.5 0 012.121 0L16 26.879l2.477-2.477a1.5 1.5 0 012.121 2.121l-3.537 3.538a1.5 1.5 0 01-2.122 0l-3.537-3.538a1.5 1.5 0 010-2.121z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M16 18.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-3 0v-9a1.5 1.5 0 011.5-1.5zM14.94 1.94a1.5 1.5 0 012.12 0l3.538 3.537a1.5 1.5 0 01-2.121 2.121L16 5.121l-2.477 2.477a1.5 1.5 0 01-2.121-2.121z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M16 1.5A1.5 1.5 0 0117.5 3v9a1.5 1.5 0 01-3 0V3A1.5 1.5 0 0116 1.5zm-8.402 9.902a1.5 1.5 0 010 2.121L5.121 16l2.477 2.477a1.5 1.5 0 11-2.121 2.121l-3.538-3.537a1.5 1.5 0 010-2.122l3.538-3.537a1.5 1.5 0 012.121 0z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M1.5 16A1.5 1.5 0 013 14.5h9a1.5 1.5 0 010 3H3A1.5 1.5 0 011.5 16zm22.902-4.598a1.5 1.5 0 012.121 0l3.538 3.537a1.5 1.5 0 010 2.122l-3.538 3.537a1.5 1.5 0 01-2.121-2.121L26.879 16l-2.477-2.477a1.5 1.5 0 010-2.121z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M18.5 16a1.5 1.5 0 011.5-1.5h9a1.5 1.5 0 010 3h-9a1.5 1.5 0 01-1.5-1.5z"
          className="fill-[var(--logo-primary)]"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(MoveIcon);