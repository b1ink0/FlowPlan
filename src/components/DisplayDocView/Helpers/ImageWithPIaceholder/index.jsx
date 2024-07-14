import React, { useState } from "react";

export const ImageWithPlaceholder = ({ src, placeholderSrc, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {!imageLoaded && (
        <img
          src={placeholderSrc}
          alt="Placeholder"
          className="mt-2 rounded-md object-contain"
        />
      )}

      <img
        src={src}
        alt={alt}
        className="mt-2 rounded-md object-contain"
        onLoad={handleImageLoad}
      />
    </>
  );
};
