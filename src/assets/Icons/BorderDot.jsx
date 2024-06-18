import React from "react";

function BorderDot() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0 fill-current"
      viewBox="0 0 24 24"
    >
      <clipPath id="a">
        <path d="M0 0h24v24H0z" className="fill-[var(--logo-primary)]"></path>
      </clipPath>
      <g clipPath="url(#a)">
        <path
          d="M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm0-2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"
          className="fill-current"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(BorderDot);
