import React from "react";

function ItalicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 512 512"
    >
      <path
        d="M434.571 23.857v35.714c0 9.862-7.995 17.857-17.857 17.857H346.67l-89.286 357.143h52.188c9.862 0 17.857 7.995 17.857 17.857v35.714c0 9.862-7.995 17.857-17.857 17.857H95.286c-9.862 0-17.857-7.995-17.857-17.857v-35.714c0-9.862 7.995-17.857 17.857-17.857h70.045l89.286-357.143H202.43c-9.862 0-17.857-7.995-17.857-17.857V23.857C184.573 13.995 192.568 6 202.43 6h214.286c9.861 0 17.855 7.995 17.855 17.857z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(ItalicIcon);
