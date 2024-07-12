import React from "react";

export const TableView = ({ field, i, currentField, handleEditField }) => {
  return (
    <div
      style={{
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
      onDoubleClick={() => handleEditField(field, i)}
    >
      <table className="w-full h-fit">
        <tbody>
          {field.data?.table?.map((row, i) => (
            <tr key={`table-row-${i}`}>
              {row?.data?.map((cell, j) => (
                <td
                  key={`table-cell-${i}-${j}`}
                  className="p-1"
                  style={{
                    borderWidth: `${field?.config?.borderWidth}px`,
                    borderColor: `${field?.config?.borderColor}`,
                    borderStyle: `${field?.config?.borderStyle}`,
                  }}
                >
                  <span
                    style={{
                      color: `${field?.config?.color}`,
                    }}
                    className="w-full h-full block"
                  >
                    {cell?.text}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
