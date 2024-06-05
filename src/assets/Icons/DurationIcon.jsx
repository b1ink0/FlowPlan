import React from "react";

function DurationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 24 24"
    >
      <g data-name="Layer 2">
        <path
          d="M16.773 8.182a.955.955 0 110-1.909h2.6l.189-2.923a.954.954 0 011.669-.567.942.942 0 01.234.69l-.246 3.815a.955.955 0 01-.951.894z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M20.266 7.944h-3.493a.716.716 0 110-1.432h2.821l.2-3.145a.732.732 0 01.759-.668.714.714 0 01.669.759l-.242 3.816a.716.716 0 01-.714.67z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M12 22.5a10.5 10.5 0 119.1-15.751.955.955 0 01-1.653.957A8.593 8.593 0 1020.591 12a.955.955 0 111.909 0A10.512 10.512 0 0112 22.5z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M12 22.261a10.261 10.261 0 118.888-15.393.716.716 0 11-1.24.718A8.831 8.831 0 1020.83 12a.716.716 0 111.431 0A10.273 10.273 0 0112 22.261z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M15.817 15.818a.939.939 0 01-.572-.192l-3.818-2.863a.959.959 0 01-.382-.763V7.227a.955.955 0 011.91 0v4.3l3.436 2.573a.956.956 0 01.191 1.337.958.958 0 01-.765.381z"
          className="fill-[var(--logo-primary)]"
        ></path>
        <path
          d="M15.817 15.58a.712.712 0 01-.429-.144l-3.818-2.864a.714.714 0 01-.286-.572V7.227a.716.716 0 111.432 0v4.415l3.532 2.649a.716.716 0 01-.431 1.289z"
          className="fill-[var(--logo-primary)]"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(DurationIcon);
