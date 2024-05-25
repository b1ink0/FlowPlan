export const TimeAndDate = ({ timeDate, absolute = true }) => {
  return (
    <span
      style={absolute ? { position: "absolute" } : {}}
      className="text-[var(--text-secondary)] text-[10px] group-hover:opacity-0 transition-opacity right-2 bottom-[1px]"
    >
      {timeDate
        ?.toTimeString()
        ?.split(" ")[0]
        ?.split(":")
        ?.slice(0, 2)
        ?.join(":")}
      {" "}
      {timeDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
};
