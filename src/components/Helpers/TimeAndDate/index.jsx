export const TimeAndDate = ({
  timeDate,
  absolute = true,
  text = "",
  group = true,
}) => {
  return (
    <span
      style={absolute ? { position: "absolute" } : {}}
      className={`text-[var(--text-secondary)] text-[10px] ${
        group ? "group-hover:opacity-0 transition-opacity" : ""
      } right-2 bottom-[1px]`}
    >
      {text}
      {timeDate?.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })}
      {" "}
      {timeDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
};
