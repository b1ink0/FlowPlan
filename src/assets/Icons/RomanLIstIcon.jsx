import React from "react";

function RomanListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0 fill-current"
      viewBox="0 0 512 512"
    >
      <path
        d="M58.817 90H512v30H58.817zm0-60H512v30H58.817zm61.808 257.075H512v30H120.625zm0-60H512v30H120.625zM178.742 482H512v30H178.742zm0-60H512v30H178.742zM0 0h30v120H0zm0 197.075h30v120H0zm59.464 0h30v120h-30zM0 392h30v120H0zm59.464 0h30v120h-30zm59.465 0h30v120h-30z"
        className="fill-current"
      ></path>
    </svg>
  );
}

export default React.memo(RomanListIcon);
