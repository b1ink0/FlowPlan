export const TimeAndDate = ({ timeDate }) => {
    console.log(timeDate);
  return (
    <span className="text-[var(--text-secondary)] absolute text-[10px] group-hover:opacity-0 transition-opacity right-2 bottom-[1px]">
      {timeDate
        ?.toTimeString()
        ?.split(" ")[0]
        ?.split(":")
        ?.slice(0, 2)
        ?.join(":")}
      {timeDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
};
