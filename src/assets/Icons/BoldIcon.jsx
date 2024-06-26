import React from "react";

function BoldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 512 512"
      className="h-full w-full  shrink-0"
      viewBox="0 0 281.332 281.332"
    >
      <path
        d="M198.102 134.449c15.233-11.431 28.497-29.829 28.497-59.239v-.753c0-18.694-6.274-34.93-18.649-48.258a8.073 8.073 0 00-.181-.189C191.021 8.994 165.96 0 135.294 0H49.656a9 9 0 00-9 9v263.332a9 9 0 009 9h90.331c29.385 0 54.297-7.214 72.043-20.863 18.741-14.414 28.647-35.157 28.647-59.988v-.753c0-29.502-14.634-51.788-42.575-65.279zm-57.393 102.175H86.813v-74.919h48.842c19.735 0 35.34 3.551 45.129 10.27 8.757 6.011 13.015 14.474 13.015 25.872v.752c0 34.32-37.128 38.025-53.09 38.025zM130.58 117.372H86.813V44.709h45.955c29.839 0 46.952 12.351 46.952 33.886v.752c-.001 33.085-30.788 38.025-49.14 38.025z"
        className="fill-[var(--logo-primary)]"                      
      ></path>
    </svg>
  );
}

export default React.memo(BoldIcon);
