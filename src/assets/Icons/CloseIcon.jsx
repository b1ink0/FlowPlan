import React from "react";

function CloseIcon({ stylePath = {}, styleSvg = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-14 w-14 group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300"
      style={styleSvg}
      enableBackground="new 0 0 512 512"
      viewBox="0 0 512 512"
    >
      <path
        d="M256 439.98c-13.81 0-25-11.19-25-25V97.02c0-13.81 11.19-25 25-25s25 11.19 25 25v317.96c0 13.81-11.19 25-25 25z"
        className="fill-red-500"
        style={stylePath}
      ></path>
      <path
        d="M414.98 281H97.02c-13.81 0-25-11.19-25-25s11.19-25 25-25h317.96c13.81 0 25 11.19 25 25s-11.19 25-25 25z"
        className="fill-red-500"
        style={stylePath}
      ></path>
      <path
        d="M256 439.98c-13.81 0-25-11.19-25-25V97.02c0-13.81 11.19-25 25-25s25 11.19 25 25v317.96c0 13.81-11.19 25-25 25z"
        className="fill-red-500 blur-2xl"
        style={stylePath}
      ></path>
      <path
        d="M414.98 281H97.02c-13.81 0-25-11.19-25-25s11.19-25 25-25h317.96c13.81 0 25 11.19 25 25s-11.19 25-25 25z"
        className="fill-red-500 blur-2xl"
        style={stylePath}
      ></path>
    </svg>
  );
}

export default React.memo(CloseIcon);
