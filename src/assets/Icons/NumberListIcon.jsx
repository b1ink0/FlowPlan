import React from "react";

function NumberListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
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
          d="M155 437h342M155 256h342M155 75h342M26 497h23.512V387M74.269 201.249s-52.492-.66-54.979.169c-2.487.829 3.987 5.207 38.402 54.38 6.428 9.183 9.966 16.931 11.471 23.422l.533 4.173C69.696 298.64 57.335 311 42.089 311c-13.416 0-24.597-9.57-27.089-22.256M17.65 102.83C20.131 115.467 31.269 125 44.633 125c15.189 0 27.5-12.312 27.5-27.5S59.822 70 44.633 70M44.634 70c15.188 0 27.5-12.312 27.5-27.5S59.822 15 44.634 15C30.748 15 19.266 25.292 17.4 38.665a27.71 27.71 0 00-.266 3.835"
          className="fill-[var(--logo-primary)]"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(NumberListIcon);
