import React from "react";

function InheritIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 512 512"
      className="h-full w-full  shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        d="M15.725 15.888a2.772 2.772 0 00-2.691 2.134H11.29a1.37 1.37 0 01-1.368-1.368v-4.72a2.546 2.546 0 001.368.4h1.72a2.787 2.787 0 10.024-1.2H11.29A1.37 1.37 0 019.922 9.77V7.707a2.773 2.773 0 10-1.2 0v8.948a2.57 2.57 0 002.568 2.567h1.72a2.772 2.772 0 102.714-3.333zm-1.566-4.173a1.492 1.492 0 11-.005.071c0-.017.01-.031.01-.048s-.005-.015-.005-.023zM9.33 6.576h-.013a1.538 1.538 0 11.013 0zm6.4 13.656a1.573 1.573 0 01-1.571-1.562c0-.017.01-.031.01-.048v-.023a1.57 1.57 0 111.566 1.633z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(InheritIcon);
