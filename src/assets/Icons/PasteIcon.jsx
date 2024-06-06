import React from "react";

function PasteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 682.667 682.667"
    >
      <defs>
        <clipPath id="a" clipPathUnits="userSpaceOnUse">
          <path d="M0 512h512V0H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
        <path
          d="M177.333 177.333h157.334m-157.334 118h157.334M177.333 492v-38.667c0-22.092 17.909-40 40-40h77.334c22.091 0 40 17.908 40 40V492m118.25-60V80c0-33.138-26.863-60-60-60H119.083c-33.137 0-60 26.862-60 60v352c0 33.137 26.863 60 60 60h273.834c33.137 0 60-26.863 60-60z"
          className="stroke-[var(--logo-primary)]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="40"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(PasteIcon);
