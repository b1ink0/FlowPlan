import React, { useEffect } from "react";

export const DurationGraphView = ({ durations, type, color }) => {
  const hours = {
    week: [24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0],
    month: [168, 153, 137, 122, 107, 92, 76, 61, 46, 31, 15, 0],
    year: [744, 672, 620, 558, 496, 434, 372, 310, 248, 186, 124, 62, 0],
  };

  useEffect(() => {
    console.log(durations);
  }, []);
  return (
    <div className="w-full h-[300px] bg-[var(--bg-secondary)] rounded-md flex justify-center items-center">
      <div className="w-[20px] h-full flex justify-between py-2 items-end">
        <div className="h-full flex flex-col justify-end items-center gap-2">
          <div className="h-full flex flex-col justify-between">
            {hours[type].map((hour, index) => {
              return (
                <div
                  key={"duration-graph-hours-" + index}
                  className="w-[30px] h-full flex flex-col justify-end items-center"
                >
                  <span className="w-full h-fit text-[10px] text-center text-[var(--text-primary)]">
                    {hour}
                  </span>
                </div>
              );
            })}
          </div>
          <span className="text-xs text-[var(--text-primary)]">H</span>
        </div>
      </div>
      <div className="w-full h-full flex justify-between items-end p-2 gap-1">
        {durations.map((duration, index) => (
          <div
            key={"duration-graph-data" + index}
            className="w-full h-full flex flex-col justify-end items-center"
          >
            <div className="w-full h-full flex flex-col justify-end items-center gap-2">
              {duration.duration !== 0 && (
                <div
                  className="w-full h-0 transition-all rounded-md text-center items-center relative"
                  style={{
                    height: `${
                      (duration.duration /
                        1000 /
                        60 /
                        60 /
                        (type === "week" ? 24 : type === "month" ? 168 : 744)) *
                      100
                    }%`,
                    backgroundColor: color,
                  }}
                >
                  <span className="w-full h-fit text-[10px] text-center text-[var(--text-primary)] #rotate-45 absolute top-0.5 left-0">
                    {duration.duration / 1000 / 60 / 60 > 1
                      ? `${Math.floor(
                          duration.duration / 1000 / 60 / 60
                        )}h${Math.round(
                          (duration.duration / 1000 / 60 / 60 -
                            Math.floor(duration.duration / 1000 / 60 / 60)) *
                            60
                        )}m`
                      : `${Math.round(duration.duration / 1000 / 60)}m`}
                  </span>
                </div>
              )}
              <span className="text-xs text-[var(--text-primary)]">
                {duration?.label?.slice(0, 3)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
