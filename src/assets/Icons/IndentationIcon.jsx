import React from "react";

function IndentationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-full w-full  shrink-0"
    >
      <path
        d="M20 7H9c-.6 0-1-.4-1-1s.4-1 1-1h11c.6 0 1 .4 1 1s-.4 1-1 1zm0 6h-7c-.6 0-1-.4-1-1s.4-1 1-1h7c.6 0 1 .4 1 1s-.4 1-1 1zm0 6H9c-.6 0-1-.4-1-1s.4-1 1-1h11c.6 0 1 .4 1 1s-.4 1-1 1zM4 17c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4L6.6 12 3.3 8.7c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4 4c.4.4.4 1 0 1.4l-4 4c-.2.2-.4.3-.7.3z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(IndentationIcon);