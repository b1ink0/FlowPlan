import React from "react";

function AlphabetListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full group-hover:scale-110 transition-transform duration-300 shrink-0 fill-current"
      version="1.1"
      viewBox="0 0 32 32"
      xmlSpace="preserve"
    >
      <g>
        <path
          fill="#000"
          strokeWidth="1.246"
          d="M30.911 5.125H10.38a.623.623 0 100 1.246H30.91a.623.623 0 100-1.246zm0 11.14H10.38a.623.623 0 100 1.245H30.91a.623.623 0 100-1.246zm0 11.138H10.38a.623.623 0 100 1.246H30.91a.623.623 0 100-1.246zM5.583 15.92a2.04 2.04 0 00.467-1.288 2.05 2.05 0 00-2.048-2.047H1.535a.623.623 0 00-.623.623c0 .308.226.55.52.602v5.261a.614.614 0 00-.52.602.623.623 0 00.623.623H4.14a2.433 2.433 0 002.43-2.43 2.42 2.42 0 00-.988-1.946zm-.779-1.288a.805.805 0 01-.802.804H2.677V13.83H4c.443 0 .803.36.803.8zm-.663 4.418H2.677v-2.368h1.464a1.186 1.186 0 010 2.368zM1.621 8.422l.66-1.958h2.408l.66 1.958a.623.623 0 101.18-.396L4.076.736c-.17-.51-1.01-.51-1.18 0L.441 8.027a.623.623 0 101.18.396zm1.864-5.535l.785 2.33H2.7zm.963 22.393H5.71a.623.623 0 100-1.246H4.449a3.81 3.81 0 00-3.805 3.804 3.81 3.81 0 003.805 3.806h1.262a.623.623 0 100-1.246H4.45a2.562 2.562 0 01-2.56-2.56 2.56 2.56 0 012.56-2.558z"
          className="fill-current"
          opacity="1"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(AlphabetListIcon);