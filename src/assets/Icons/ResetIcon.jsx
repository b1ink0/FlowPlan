import React from "react";

function ResetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 24 24"
    >
      <path
        d="M11.87 2a10.164 10.164 0 00-5.7 1.752L4.707 2.294A1 1 0 003 3v5a1 1 0 001 1h5a1 1 0 00.707-1.707l-.621-.621A6.126 6.126 0 0118 12a6.145 6.145 0 01-12.065 1.5 2 2 0 00-3.87 1.01A10.144 10.144 0 0022 12 10.077 10.077 0 0011.87 2z"
        className="fill-gray-200"
      ></path>
    </svg>
  );
}

export default React.memo(ResetIcon);
