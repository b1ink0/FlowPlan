import React from "react";

function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 32 32"
    >
      <path
        d="M28.1 12.7l-8.8-8.8c-.4-.4-1-.4-1.4 0l-3.2 3.2c-.5.5-.3 1.1 0 1.4l.7.7-3 3c-1.5-.3-5.6-1-7.8 1.2-.4.4-.4 1 0 1.4l5.7 5.7L4 26.8c-.4.4-.4 1 0 1.4s1.1.3 1.4 0l6.3-6.3 5.7 5.7c.6.5 1.2.3 1.4 0 2.2-2.2 1.5-6.3 1.2-7.8l3-3 .7.7c.4.4 1 .4 1.4 0l3.2-3.2c.2-.6.2-1.2-.2-1.6zm-3.9 2.5l-.7-.7c-.4-.4-1-.4-1.4 0L18 18.7c-.3.3-.4.6-.3 1 .3 1.1.8 3.8 0 5.6l-11-11c1.7-.8 4.5-.3 5.6 0 .3.1.7 0 1-.3l4.1-4.1c.6-.6.3-1.1 0-1.4l-.7-.7L18.6 6l7.4 7.4z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(PinIcon);
