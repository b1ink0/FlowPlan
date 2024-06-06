import React from "react";

function ParagraphIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 310 310"
    >
      <path
        d="M286.875 0h-180c-46.18 0-83.75 37.57-83.75 83.75s37.57 83.75 83.75 83.75h35V310h30V30h40v280h30V30h45V0zm-145 137.5h-35c-29.638 0-53.75-24.112-53.75-53.75S77.237 30 106.875 30h35v107.5z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(ParagraphIcon);
