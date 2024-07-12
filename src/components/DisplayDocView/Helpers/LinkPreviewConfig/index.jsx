import CheckedIcon from "../../../../assets/Icons/CheckedIcon.jsx";
import UncheckedIcon from "../../../../assets/Icons/UncheckedIcon.jsx";
import React from "react";

export const LinkPreviewConfig = ({ linkPreview, setLinkPreview }) => {
  const previewFields = [
    {
      type: "title",
      text: "Title",
    },
    {
      type: "description",
      text: "Description",
    },
    {
      type: "favicon",
      text: "Favicon",
    },
    {
      type: "siteName",
      text: "Sitename",
    },
    {
      type: "previewImages",
      text: "Images",
    },
  ];
  const handleSetPreviewLink = (key) => {
    setLinkPreview((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        show: prev[key]?.show ? false : true,
      },
    }));
  };
  return (
    <div className="absolute px-2 py-1 rounded-md left-0 top-9 w-fit flex flex-col gap-2 bg-[var(--btn-secondary)] z-10">
      {previewFields?.map((item) => (
        <div
          key={`preview-id-${item.type}`}
          className="w-full flex gap-1 justify-start items-center "
        >
          <span
            className="w-4 h-4 mr-1 block cursor-pointer"
            onClick={() => handleSetPreviewLink(item.type)}
          >
            {linkPreview[item.type] && linkPreview[item.type]?.show ? (
              <CheckedIcon />
            ) : (
              <UncheckedIcon />
            )}
          </span>
          <label className="text-xs text-[var(--text-primary)]">
            {item.text}
          </label>
        </div>
      ))}
    </div>
  );
};
