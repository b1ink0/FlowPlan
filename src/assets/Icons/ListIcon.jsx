import React from "react";

function ListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 60.123 60.123"
    >
      <path
        d="M57.124 51.893H16.92a3 3 0 110-6h40.203a3 3 0 01.001 6zm0-18.831H16.92a3 3 0 110-6h40.203a3 3 0 01.001 6zm0-18.831H16.92a3 3 0 110-6h40.203a3 3 0 01.001 6z"
        className="fill-[var(--logo-primary)]"
      ></path>
      <circle
        cx="4.029"
        cy="11.463"
        r="4.029"
        className="fill-[var(--logo-primary)]"
      ></circle>
      <circle
        cx="4.029"
        cy="30.062"
        r="4.029"
        className="fill-[var(--logo-primary)]"
      ></circle>
      <circle
        cx="4.029"
        cy="48.661"
        r="4.029"
        className="fill-[var(--logo-primary)]"
      ></circle>
    </svg>
  );
}

export default React.memo(ListIcon);
