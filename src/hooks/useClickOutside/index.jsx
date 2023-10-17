import { useEffect, useRef, useState } from "react";

const useClickOutside = (initialState) => {
  const [isActive, setIsActive] = useState(initialState);
  const ref = useRef(null);

  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return { ref, isActive, setIsActive };
};

export default useClickOutside;
