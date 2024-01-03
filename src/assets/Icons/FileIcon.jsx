import React from "react";

function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 511.999 511"
    >
      <path
        d="M473.602 77.3H299.699L226.65 4.25A12.78 12.78 0 00217.601.5H38.398C17.203.523.023 17.703 0 38.898v384c.023 21.2 17.203 38.38 38.398 38.403h435.2c21.199-.024 38.379-17.203 38.402-38.403V115.7c-.023-21.199-17.203-38.375-38.398-38.398zM38.398 26.103h173.903L263.5 77.3H25.598V38.898c.007-7.066 5.734-12.793 12.8-12.796zm448 396.796c-.003 7.07-5.73 12.797-12.8 12.801h-435.2c-7.066-.004-12.793-5.73-12.8-12.8v-320h448c7.07.003 12.797 5.734 12.8 12.8zm0 0"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(FileIcon);
