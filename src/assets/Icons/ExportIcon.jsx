import React from "react";

function ExportIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className="h-full w-full  shrink-0"
      viewBox='0 0 24 24'
    >
      <path
        d='M23 11v7.2a2.91 2.91 0 01-3 2.8H4a2.91 2.91 0 01-3-2.8V11a1 1 0 012 0v7.2a.93.93 0 001 .8h16a.93.93 0 001-.8V11a1 1 0 012 0zM9.59 7.83L11 6.41V15a1 1 0 002 0V6.41l1.41 1.42a1 1 0 001.42 0 1 1 0 00.29-.71 1 1 0 00-.29-.71l-3.12-3.12a1 1 0 00-.64-.29h-.19a1 1 0 00-.54.24h-.05L8.17 6.41a1 1 0 101.42 1.42z'
        data-name='Layer 24'
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(ExportIcon)