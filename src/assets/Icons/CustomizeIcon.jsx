import React from "react";

function CustomizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 28 28"
    >
      <switch>
        <g>
          <path
            d="M17 18c0 1.3-.8 2.4-2 2.8V24c0 .6-.4 1-1 1s-1-.4-1-1v-3.2c-1.6-.5-2.4-2.2-1.8-3.8.3-.9 1-1.5 1.8-1.8V4c0-.6.4-1 1-1s1 .4 1 1v11.2c1.2.4 2 1.5 2 2.8zm8-8c0-1.3-.8-2.4-2-2.8V4c0-.6-.4-1-1-1s-1 .4-1 1v3.2c-1.6.5-2.4 2.2-1.8 3.8.3.9 1 1.5 1.8 1.8V24c0 .6.4 1 1 1s1-.4 1-1V12.8c1.2-.4 2-1.5 2-2.8zM7 7.2V4c0-.6-.4-1-1-1s-1 .4-1 1v3.2c-1.6.5-2.4 2.2-1.8 3.8.3.9 1 1.5 1.8 1.8V24c0 .6.4 1 1 1s1-.4 1-1V12.8c1.6-.5 2.4-2.2 1.8-3.8-.3-.8-.9-1.5-1.8-1.8z"
            className="fill-[var(--logo-primary)]"
          ></path>
        </g>
      </switch>
    </svg>
  );
}

export default React.memo(CustomizeIcon);
