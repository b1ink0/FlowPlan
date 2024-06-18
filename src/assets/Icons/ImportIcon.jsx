import React from "react";

function ImportIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className="h-full w-full  shrink-0"
      x='0'
      y='0'
      version='1.1'
      viewBox='0 0 24 24'
      xmlSpace='preserve'
    >
      <g>
        <path
        className="fill-[var(--logo-primary)]"
        
        d='M11.978 3c-.5 0-1 .333-1 1v8.59l-1.41-1.42a1 1 0 00-1.71.71 1 1 0 00.29.71l3.12 3.12a1 1 0 00.64.29h.19a1 1 0 00.54-.24h.05l3.12-3.17c.947-.947-.474-2.367-1.42-1.42l-1.41 1.42V4c0-.667-.5-1-1-1zM2 10c-.5 0-1 .333-1 1v7.2A2.91 2.91 0 004 21h16c1.6.05 2.94-1.2 3-2.8V11c0-1.333-2-1.333-2 0v7.2a.93.93 0 01-1 .8H4a.93.93 0 01-1-.8V11c0-.667-.5-1-1-1z'></path>
      </g>
    </svg>
  );
}

export default React.memo(ImportIcon);