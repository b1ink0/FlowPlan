import React from "react";

function SelectedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 64 64"
    >
      <path
        d="M32.016 58.003c-9.888.001-19.006-5.665-23.373-14.583-4.419-9.027-3.081-20.285 3.331-28.014C18.379 7.685 28.792 4.316 38.5 6.823a2.002 2.002 0 01-1 3.874c-8.212-2.121-17.026.729-22.447 7.264-5.424 6.539-6.556 16.064-2.817 23.702 3.725 7.608 11.942 12.564 20.376 12.334 8.433-.23 16.086-5.359 19.497-13.066a22.13 22.13 0 001.192-14.432 2.001 2.001 0 013.874-1 26.155 26.155 0 01-1.407 17.051c-4.032 9.11-13.079 15.173-23.046 15.445-.236.005-.472.008-.706.008z"
        className="fill-[var(--logo-primary)]"
      ></path>
      <path
        d="M32 38.24a2 2 0 01-1.414-3.414l24-24a2 2 0 112.828 2.828l-24 24c-.39.39-.902.586-1.414.586z"
        className="fill-[var(--logo-primary)]"
      ></path>
      <path
        d="M32 38.24a1.99 1.99 0 01-1.414-.586l-8.485-8.485a2 2 0 112.828-2.828l8.485 8.485A2 2 0 0132 38.24z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(SelectedIcon);