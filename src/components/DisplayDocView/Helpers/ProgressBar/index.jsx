import React from "react";

export const ProgressBar = ({
  progress,
  showPercentage = true,
  multiColor = true,
  color = null,
  border = false,
}) => {
  return (
    <div className="w-full overflow-hidden h-4 flex justify-center items-center rounded-md relative">
      {showPercentage && (
        <span
          style={{
            textShadow: "0 0 5px rgba(0,0,0,1)",
          }}
          className="absolute text-xs text-[var(--text-primary)] font-bold"
        >
          {Math.floor(progress)}%
        </span>
      )}
      <div
        style={{
          background: border ? "var(--bg-quaternary)" : "",
        }}
        className="w-full h-2 bg-[var(--btn-secondary)] rounded-md "
      >
        <div
          className="h-full rounded-md transition-all duration-200"
          style={{
            width: `${progress}%`,
            background: multiColor
              ? progress < 20
                ? "red"
                : progress < 40
                ? "#9129d4"
                : progress < 60
                ? "orange"
                : progress < 80
                ? "yellow"
                : progress < 100
                ? "skyblue"
                : progress === 100
                ? "#199d19"
                : ""
              : color,
          }}
        ></div>
      </div>
    </div>
  );
};
