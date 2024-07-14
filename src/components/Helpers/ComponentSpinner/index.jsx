import React from "react";

function ComponetSpinner({ children }) {
  return <div className="animate-pulse w-full h-full">{children}</div>;
}

export default ComponetSpinner;
