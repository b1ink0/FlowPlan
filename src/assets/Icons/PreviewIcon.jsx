import React from "react";

function PreviewIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 512 512"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0"
      viewBox="0 0 64 64"
    >
      <path
        d="M31.991 48.248c-.452 0-.905-.012-1.36-.036-9.677-.516-18.492-6.558-22.456-15.394a2 2 0 113.65-1.637c3.357 7.482 10.822 12.6 19.019 13.036 9.046.485 17.617-4.758 21.332-13.036a2 2 0 013.65 1.637c-4.201 9.361-13.661 15.43-23.835 15.43z"
        className="fill-[var(--logo-primary)]"
      ></path>
      <path
        d="M9.999 34.001a2 2 0 01-1.824-2.82c4.387-9.776 14.515-15.958 25.194-15.394 9.677.516 18.492 6.558 22.456 15.394a2 2 0 11-3.65 1.637c-3.357-7.482-10.822-12.6-19.019-13.036-9.042-.483-17.617 4.758-21.332 13.036a1.997 1.997 0 01-1.825 1.183z"
        className="fill-[var(--logo-primary)]"
      ></path>
      <path
        d="M32 40.242c-4.545 0-8.243-3.697-8.243-8.242s3.698-8.242 8.243-8.242 8.243 3.697 8.243 8.242-3.698 8.242-8.243 8.242zm0-12.484c-2.3 0-4.243 1.942-4.243 4.242S29.7 36.242 32 36.242 36.243 34.3 36.243 32 34.3 27.758 32 27.758z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(PreviewIcon);
