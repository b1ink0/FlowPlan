import React from "react";

function CopyStyleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 682.667 682.667"
    >
      <path
        d="M565 640H225c-41.36 0-75-33.64-75-75V225c0-41.36 33.64-75 75-75h340c41.36 0 75 33.64 75 75v340c0 41.36-33.64 75-75 75zM225 200c-13.785 0-25 11.215-25 25v340c0 13.785 11.215 25 25 25h340c13.785 0 25-11.215 25-25V225c0-13.785-11.215-25-25-25zM100 440H75c-13.785 0-25-11.215-25-25V75c0-13.785 11.215-25 25-25h340c13.785 0 25 11.215 25 25v23.75h50V75c0-41.36-33.64-75-75-75H75C33.64 0 0 33.64 0 75v340c0 41.36 33.64 75 75 75h25zm0 0"
        className="fill-[var(--logo-primary)]"
      ></path>
      <text
        style={{ whiteSpace: "pre" }}
        x="260.833"
        y="548.274"
        className="fill-[var(--logo-primary)]"
        fontFamily="Arial, sans-serif"
        fontSize="422"
        fontWeight="700"
      >
        S
      </text>
    </svg>
  );
}

export default React.memo(CopyStyleIcon);
