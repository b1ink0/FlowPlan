import React from "react";

function LinewrapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 50 50"
    >
      <path
        d="M6.25 14.583h37.5a2.083 2.083 0 000-4.166H6.25a2.083 2.083 0 000 4.166zm12.5 16.667H6.25a2.083 2.083 0 000 4.167h12.5a2.083 2.083 0 000-4.167zm19.792-10.417H6.25a2.083 2.083 0 000 4.167h32.292a3.125 3.125 0 110 6.25h-6.438l.625-.604a2.092 2.092 0 10-2.958-2.959l-4.167 4.167c-.19.198-.338.432-.437.688a2.084 2.084 0 000 1.583c.099.256.248.49.437.688l4.167 4.166a2.085 2.085 0 002.958 0 2.082 2.082 0 000-2.958l-.625-.604h6.438a7.292 7.292 0 000-14.584z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(LinewrapIcon);
