import React from "react";

function SeparatorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 682.667 682.667"
    >
      <defs>
        <clipPath id="a" clipPathUnits="userSpaceOnUse">
          <path
            d="M0 512h512V0H0z"
            className="fill-[var(--logo-primary)]"
          ></path>
        </clipPath>
      </defs>
      <g
        fill="none"
        className="stroke-[var(--logo-primary)]"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="30"
        clipPath="url(#a)"
        transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
      >
        <path
          d="M497 497V377c0-22.092-17.908-40-40-40H55c-22.092 0-40 17.908-40 40v120M15 15v120c0 22.092 17.908 40 40 40h402c22.092 0 40-17.908 40-40V15M15 256h30M105.4 256h30M497 256h-30M406.6 256h-30M195.8 256h30M286.2 256h30"
          className="fill-[var(--logo-primary)]"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(SeparatorIcon);
