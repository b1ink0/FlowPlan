import React from "react";

function CloudIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full  shrink-0"
      viewBox="0 0 512 512"
    >
      <path
        d="M421 406H91c-24.05 0-46.794-9.327-64.042-26.264C9.574 362.667 0 340.031 0 316s9.574-46.667 26.958-63.736c13.614-13.368 30.652-21.995 49.054-25.038A62.257 62.257 0 0176 226c0-66.168 53.832-120 120-120 24.538 0 48.119 7.387 68.194 21.363 14.132 9.838 25.865 22.443 34.587 37.043C312.86 155.673 329.099 151 346 151c44.886 0 82.202 33.026 88.921 76.056 18.811 2.88 36.244 11.581 50.122 25.208C502.426 269.333 512 291.968 512 316s-9.574 46.667-26.957 63.736C467.794 396.673 445.05 406 421 406zM91 256c-33.636 0-61 26.916-61 60s27.364 60 61 60h330c33.636 0 61-26.916 61-60s-27.364-60-61-60h-15v-15c0-33.084-26.916-60-60-60-15.766 0-30.68 6.12-41.995 17.233l-16.146 15.858-8.315-21.049C265.855 158.391 233.062 136 196 136c-49.626 0-90 40.374-90 90 0 3.544.556 7.349 1.144 11.378L109.831 256z"
        className="fill-[var(--logo-primary)]"
      ></path>
    </svg>
  );
}

export default React.memo(CloudIcon);