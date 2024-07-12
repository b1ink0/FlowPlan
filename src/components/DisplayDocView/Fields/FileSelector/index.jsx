import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useState } from "react";
import { v4 } from "uuid";
import FileIcon from "../../../../assets/Icons/FileIcon.jsx";
import { InputTitleButtons } from "../../Helpers/InputTitleButtons/index.jsx";

export const FileSelector = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();
  const [file, setFile] = useState(currentField?.data?.file?.url ?? null);
  const [name, setName] = useState(currentField?.data?.file?.name ?? null);
  const [error, setError] = useState(null);
  const handleFileChange = (e) => {
    setError(null);
    if (!e.target.files[0]) return;
    const maxSizeInBytes = 1024 * 1024 * 5;
    if (e.target.files[0].size > maxSizeInBytes) {
      setError("File size should be less than 5MB");
      return;
    }
    setFile(e.target.files[0]);
    setName(e.target.files[0].name);
  };

  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsDataURL(file);
    });
  };

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    if (!file) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let fileB64;

    if (typeof file === "string") {
      fileB64 = file;
    } else {
      fileB64 = await handleFileToBase64(file);
    }

    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        file: {
          url: fileB64,
          name: name,
          mimiType: file?.type ?? currentField?.data?.file?.mimiType ?? null,
        },
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <div className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md">
      <div className="w-full h-fit flex justify-center items-center flex-col p-1 gap-2">
        <input
          type="text"
          placeholder="File Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-fit bg-[var(--bg-secondary)] p-1 text-[var(--text-primary)] text-sm outline-none transition-colors duration-300 cursor-pointer resize-none"
          style={{
            fontSize: `${currentField?.config?.fontSize}px`,
            textDecoration: `${
              currentField?.config?.strickthrough ? "line-through" : "none"
            }`,
            fontStyle: `${currentField?.config?.italic ? "italic" : "normal"}`,
            fontWeight: `${currentField?.config?.bold ? "bold" : "normal"}`,
            fontFamily: `${currentField?.config?.fontFamily}`,
            color: `${currentField?.config?.color}`,
            textAlign: `${currentField?.config?.align}`,
          }}
        />
        {error && (
          <span className="text-[var(--btn-delete)] text-xs font-bold">
            {error}
          </span>
        )}
        <div className="w-full h-16 relative">
          <input
            className="w-full h-full opacity-0 cursor-pointer"
            type="file"
            accept="*"
            onChange={handleFileChange}
          />
          <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center pointer-events-none">
            <button className="w-full h-full flex justify-center items-center border-2 border-dashed  border-[var(--border-primary)] rounded-md text-[var(--text-primary)] text-xs font-bold">
              <span className="w-5 h-5 mr-2 flex justify-center items-center">
                <FileIcon />
              </span>
              <span className="text-[var(--text-primary)] text-sm">
                {file ? "Change File" : "Select File"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
      />
    </div>
  );
};
