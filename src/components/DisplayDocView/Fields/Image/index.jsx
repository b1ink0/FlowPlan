import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useState } from "react";
import { v4 } from "uuid";
import ImageIcon from "../../../../assets/Icons/ImageIcon.jsx";
import { InputTitleButtons } from "../../Helpers/InputTitleButtons/index.jsx";

export const Image = ({
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
  const [image, setImage] = useState(currentField?.data?.image?.url ?? null);
  const [name, setName] = useState(currentField?.data?.image?.name ?? null);
  const [error, setError] = useState(null);
  const handleImageChange = (e) => {
    setError(null);
    if (!e.target.files[0]) return;
    const maxSizeInBytes = 1024 * 1024 * 1;
    if (e.target.files[0].size > maxSizeInBytes) {
      setError("Image size should be less than 1MB");
      return;
    }
    setImage(e.target.files[0]);
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
    if (!image) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    if (typeof image === "string") {
      setCurrentFieldType(null);
      setCurrentField(null);
      return;
    }
    let imageB64 = await handleFileToBase64(image);
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        image: {
          url: imageB64,
          name: name,
          mimiType: image.type,
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
        {error && (
          <span className="text-[var(--btn-delete)] text-xs font-bold">
            {error}
          </span>
        )}
        {image && (
          <div className="w-full h-fit relative flex justify-center items-center overflow-hidden">
            <img
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt="preview"
              className="w-full rounded-md object-contain"
            />
          </div>
        )}
        <div className="w-full h-16 relative">
          <input
            className="w-full h-full opacity-0 cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center pointer-events-none">
            <button className="w-full h-full flex justify-center items-center border-2 border-dashed  border-[var(--border-primary)] rounded-md text-[var(--text-primary)] text-xs font-bold">
              <span className="w-6 h-6 mr-1 flex justify-center items-center">
                <ImageIcon />
              </span>
              <span className="text-[var(--text-primary)] text-sm">
                {image ? "Change Image" : "Select Image"}
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
