import React from "react";

function FontIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 512 512"
    >
      <path
        d="M229.389 405.861c-6.381-.055-10.512-3.042-12.761-9.285-4.492-12.465-8.987-24.93-13.318-37.451-.847-2.448-1.98-3.259-4.611-3.252-36.909.097-73.819.093-110.728.008-2.596-.006-3.807.712-4.676 3.242-4.225 12.3-8.643 24.535-13.063 36.767-2.662 7.367-6.506 9.982-14.285 9.98-12.06-.003-24.119.04-36.179-.007-10.602-.042-16.246-7.957-12.716-17.958 8.951-25.356 89.578-252.169 93.601-263.395 4.574-12.765 12.673-18.525 26.144-18.562 11.085-.031 22.171-.035 33.256.002 13.084.044 21.254 5.83 25.808 18.039 2.74 7.346 86.41 243.099 93.678 263.746 3.612 10.261-1.965 18.067-12.872 18.132-6.337.038-31.187.046-37.278-.006zm-86.143-213.549l-36.065 100.754h72.31l-36.245-100.754zm362.63 3.118c0-9.654-4.926-14.638-14.558-14.711-6.585-.044-13.162-.022-19.74-.022-10.093 0-14.2 3.42-15.976 13.732-1.359-.672-2.426-1.199-3.486-1.739-30.658-15.574-61.725-16.4-92.15-.329-33.655 17.781-51.56 46.437-53.767 84.527-.563 9.713-.073 19.484-.219 29.226-.139 9.954 1.133 19.769 4.327 29.116 11.964 35.065 35.679 57.969 71.679 67.558 19.769 5.262 39.304 3.8 58.357-3.53 5.021-1.929 9.844-4.348 14.77-6.541 1.63 10.115 8.631 13.615 16.034 13.345 6.694-.234 13.411-.227 20.105-.044 8.806.234 14.777-5.949 14.748-14.704-.227-65.292-.124-130.592-.124-195.884zm-62.501 110.245c0 20.734-16.802 37.543-37.542 37.543-20.734 0-37.543-16.809-37.543-37.543v-24.877c0-20.741 16.809-37.55 37.543-37.55 10.37 0 19.754 4.202 26.551 10.999 6.789 6.797 10.992 16.18 10.992 26.551v24.877z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(FontIcon);