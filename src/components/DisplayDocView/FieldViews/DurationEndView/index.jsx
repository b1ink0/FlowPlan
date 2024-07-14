import React from "react";

export const DurationEndView = ({ node, field, currentField }) => {
  return (
    <div
      style={{
        backgroundColor: `${field?.config?.color}`,
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      className="flex mb-2 mt-1 flex-wrap justify-between items-center text-xs w-full px-2 py-1 bg-[var(--btn-secondary)] rounded-br-md rounded-bl-md"
    >
      <div className="w-full flex justify-center items-center gap-2 flex-wrap">
        <span className="w-full text-center">End of Duration</span>
      </div>
    </div>
  );
};
