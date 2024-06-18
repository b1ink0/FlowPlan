import React from "react";

function FullScreenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 512 512"
    >
      <path
        d="M181.2 32a32 32 0 01-32 32H64v85.2a32 32 0 01-64 0V32A32 32 0 0132 0h117.2a32 32 0 0132 32zm-32 416H64v-85.2a32 32 0 00-64 0V480a32 32 0 0032 32h117.2a32 32 0 100-64zM480 330.8a32 32 0 00-32 32V448h-85.2a32 32 0 100 64H480a32 32 0 0032-32V362.8a32 32 0 00-32-32zM480 0H362.8a32 32 0 000 64H448v85.2a32 32 0 1064 0V32a32 32 0 00-32-32z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(FullScreenIcon);
