import React from "react";

function StarDot() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0 fill-current"
      viewBox="0 0 32 32"
    >
      <path
        d="M29.911 13.75l-6.229 6.072 1.471 8.576a1 1 0 01-1.451 1.054L16 25.403l-7.701 4.048a1 1 0 01-1.451-1.054l1.471-8.576-6.23-6.071a1 1 0 01.555-1.706l8.609-1.25 3.85-7.802c.337-.683 1.457-.683 1.794 0l3.85 7.802 8.609 1.25a1.002 1.002 0 01.555 1.706z"
        className="fill-current"
      ></path>
    </svg>
  );
}

export default React.memo(StarDot);
