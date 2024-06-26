import React from "react";

function TableIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 512 512"
    >
      <path
        d="M453.332 469.332H58.668C26.305 469.332 0 443.032 0 410.668v-352C0 26.305 26.305 0 58.668 0h394.664C485.695 0 512 26.305 512 58.668v352c0 32.363-26.305 58.664-58.668 58.664zM58.668 32C43.968 32 32 43.969 32 58.668v352c0 14.7 11.969 26.664 26.668 26.664h394.664c14.7 0 26.668-11.965 26.668-26.664v-352C480 43.968 468.031 32 453.332 32zm0 0"
        className="fill-[var(--logo-primary)]"
      ></path>
      <path
        d="M496 160H16c-8.832 0-16-7.168-16-16s7.168-16 16-16h480c8.832 0 16 7.168 16 16s-7.168 16-16 16zm0 106.668H16c-8.832 0-16-7.168-16-16s7.168-16 16-16h480c8.832 0 16 7.168 16 16s-7.168 16-16 16zm0 106.664H16c-8.832 0-16-7.168-16-16s7.168-16 16-16h480c8.832 0 16 7.168 16 16s-7.168 16-16 16zm0 0"
        className="fill-[var(--logo-primary)]"
      ></path>
      <path
        d="M133.332 469.332c-8.832 0-16-7.168-16-16V144c0-8.832 7.168-16 16-16s16 7.168 16 16v309.332c0 8.832-7.168 16-16 16zm122.668 0c-8.832 0-16-7.168-16-16V144c0-8.832 7.168-16 16-16s16 7.168 16 16v309.332c0 8.832-7.168 16-16 16zm122.668 0c-8.832 0-16-7.168-16-16V144c0-8.832 7.168-16 16-16s16 7.168 16 16v309.332c0 8.832-7.168 16-16 16zm0 0"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(TableIcon);
