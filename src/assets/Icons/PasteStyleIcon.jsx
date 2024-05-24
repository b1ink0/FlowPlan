import React from "react";

function PasteStyleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 682.667 682.667"
    >
      <path
        fill="none"
        className="stroke-[var(--logo-primary)]"
        strokeWidth="30"
        d="M177.333 492v-38.667c0-22.092 17.909-40 40-40h77.334c22.091 0 40 17.908 40 40V492m118.25-60V80c0-33.138-26.863-60-60-60H119.083c-33.137 0-60 26.862-60 60v352c0 33.137 26.863 60 60 60h273.834c33.137 0 60-26.863 60-60z"
        transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
      ></path>
      <text
        style={{ whiteSpace: "pre" }}
        x="175.484"
        y="575.025"
        className="fill-[var(--logo-primary)]"
        fontFamily="Arial, sans-serif"
        fontSize="524"
        fontWeight="700"
      >
        S
      </text>
    </svg>
  );
}

export default React.memo(PasteStyleIcon);