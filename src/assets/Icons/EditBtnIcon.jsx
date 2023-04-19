import React from "react";

function EditBtnIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 100 100"
    >
      <path
        className="fill-gray-200"
        d="M18 84.2c1 0 1.2-.1 2.1-.3l18-3.6c1.9-.5 3.8-1.4 5.3-2.9L87 33.8c6.7-6.7 6.7-18.2 0-24.9L83.3 5c-6.7-6.7-18.3-6.7-25 0L14.7 48.7c-1.4 1.4-2.4 3.4-2.9 5.3L8 72.2c-.5 3.4.5 6.7 2.9 9.1 1.9 1.9 4.7 2.9 7.1 2.9zm3.4-28.3L65 12.2c2.9-2.9 8.2-2.9 11 0l3.8 3.8c3.4 3.4 3.4 8.2 0 11.5L36.3 71.2l-18.5 3.1zm65.2 34.5H12.8c-2.9 0-4.8 1.9-4.8 4.8s2.4 4.8 4.8 4.8h73.4c2.9 0 5.3-1.9 5.3-4.8-.1-2.9-2.5-4.8-4.9-4.8z"
      ></path>
    </svg>
  );
}

export default React.memo(EditBtnIcon);