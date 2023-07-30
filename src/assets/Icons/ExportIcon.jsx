import React from "react";

function ExportIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 24 24"
    >
      <g fillRule="evenodd" clipRule="evenodd">
        <path
          d="M3.879 1.879A3 3 0 016 1h8.5a1 1 0 01.707.293l5.5 5.5A1 1 0 0121 7.5V20a3 3 0 01-3 3H4a1 1 0 110-2h14a1 1 0 001-1V7.914L14.086 3H6a1 1 0 00-1 1v4a1 1 0 01-2 0V4a3 3 0 01.879-2.121z"
          className="fill-gray-200"
        ></path>
        <path
          d="M14 1a1 1 0 011 1v5h5a1 1 0 110 2h-6a1 1 0 01-1-1V2a1 1 0 011-1zM1 15a1 1 0 011-1h10a1 1 0 110 2H2a1 1 0 01-1-1z"
          className="fill-gray-200"
        ></path>
        <path
          d="M8.293 11.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L10.586 15l-2.293-2.293a1 1 0 010-1.414z"
          className="fill-gray-200"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(ExportIcon);
