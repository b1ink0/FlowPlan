import React from "react";

function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 24 24"
    >
      <path
        className="fill-gray-200"
        d="M19 7a1 1 0 00-1 1v11.191A1.92 1.92 0 0115.99 21H8.01A1.92 1.92 0 016 19.191V8a1 1 0 00-2 0v11.191A3.918 3.918 0 008.01 23h7.98A3.918 3.918 0 0020 19.191V8a1 1 0 00-1-1zm1-3h-4V2a1 1 0 00-1-1H9a1 1 0 00-1 1v2H4a1 1 0 000 2h16a1 1 0 000-2zM10 4V3h4v1z"
      ></path>
      <path
        className="fill-gray-200"
        d="M11 17v-7a1 1 0 00-2 0v7a1 1 0 002 0zm4 0v-7a1 1 0 00-2 0v7a1 1 0 002 0z"
      ></path>
    </svg>
  );
}

export default React.memo(DeleteIcon);