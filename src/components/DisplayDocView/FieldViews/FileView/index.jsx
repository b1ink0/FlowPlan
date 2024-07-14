import FileIcon from "../../../../assets/Icons/FileIcon.jsx";
import DownloadIcon from "../../../../assets/Icons/DownloadIcon.jsx";
import React from "react";

export const FileView = ({
  field,
  i,
  node,
  setNode,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleEditField,
}) => {
  const handleDownload = () => {
    const base64Data = field?.data?.file?.url;
    const [, mimeType, base64String] = base64Data.match(
      /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/
    );

    // Convert the base64 string to a Uint8Array
    const binaryData = atob(base64String);
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: mimeType });

    // Create a File from the Blob
    const file = new File(
      [blob],
      field?.data?.file?.name + "." + mimeType.split("/")[1],
      { type: mimeType }
    );

    // You can now use the 'file' variable as a File object
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = field?.data?.file?.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
      onDoubleClick={() => handleEditField(field, i)}
    >
      <div className="w-full flex justify-center items-center overflow-x-hidden gap-1 pr-1">
        <span
          href={field?.data?.file?.url}
          target="_blank"
          rel="noreferrer"
          className="w-full flex gap-1 text-[var(--text-primary)] bg-transparent outline-none hover:underline break-all"
          style={{
            fontSize: `${field?.config?.fontSize}px`,
            textDecoration: `${
              field?.config?.strickthrough ? "line-through" : "none"
            }`,
            fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
            fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
            fontFamily: `${field?.config?.fontFamily}`,
            color: `${field?.config?.color}`,
            textAlign: `${field?.config?.align}`,
          }}
        >
          <span
            style={{
              color: `${field?.config?.color}`,
            }}
            className="w-4 h-4 shrink-0 ml-1 mr-1 block"
          >
            <FileIcon />
          </span>
          <span
            className=" shrink-0 w-4 h-4 p-0 flex justify-center items-center bg-[var(--bg-secondary)] rounded-sm hover:bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={handleDownload}
          >
            <DownloadIcon />
          </span>
          {field?.data?.file?.name}
        </span>
      </div>
    </div>
  );
};
