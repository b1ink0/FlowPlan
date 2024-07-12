import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import LinkIcon from "../../../../assets/Icons/LinkIcon.jsx";
import CheckedIcon from "../../../../assets/Icons/CheckedIcon.jsx";
import UncheckedIcon from "../../../../assets/Icons/UncheckedIcon.jsx";
import { InputTitleButtons } from "../../Helpers/InputTitleButtons/index.jsx";

export const Link = ({
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

  const [link, setLink] = useState(currentField?.data?.link ?? "");
  const [isValidLink, setIsValidLink] = useState(true);
  const [preview, setPreview] = useState(
    currentField?.data?.previewLink ?? null
  );
  const [loading, setLoading] = useState(false);

  const handleLinkChange = (e) => {
    if (e.target.value === "") {
      setIsValidLink(true);
    } else {
      setIsValidLink(e.target.value.match(/^(ftp|http|https):\/\/[^ "]+$/));
    }
    setLink(e.target.value);
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

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    if (link === "") return;
    if (!isValidLink) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });

    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        link: link,
        previewLink: {
          title: preview?.title,
          description: preview?.description,
          previewImages: preview?.previewImages,
          favicon: preview?.favicon,
          siteName: preview?.siteName,
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

  const handlePreview = async () => {
    setPreview(null);
    setLoading(true);
    if (link === "") return setLoading(false);
    if (!isValidLink) return setLoading(false);
    try {
      const url = "https://get-website-preview.vercel.app" + "?link=" + link;
      const data = await fetch(url, {
        method: "GET",
        // mode: "no-cors",
      });
      let res = await data.json();
      console.log(res);
      if (!res.success) {
        setPreview(null);
        setLoading(false);
        return;
      }
      let tempPreview = {};
      Object.keys(res.data).forEach((key) => {
        if (res.data[key] !== "") {
          if (key === "previewImages") {
            tempPreview[key] = {
              value: res.data[key].map((image, i) => {
                return {
                  url: image,
                  show: currentField?.data?.previewLink?.previewImages?.value
                    ? currentField?.data?.previewLink?.previewImages?.value[i]
                        ?.show ?? true
                    : true,
                };
              }),
              show:
                currentField?.data?.previewLink?.previewImages?.show ?? true,
            };
          } else {
            tempPreview[key] = {
              value: res.data[key],
              show: currentField?.data?.previewLink?.[key]?.show ?? true,
            };
          }
        }
      });

      setPreview(tempPreview);
      setCurrentField({
        ...currentField,
        config: {
          ...currentField.config,
          preview: true,
        },
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setPreview(null);
      setLoading(false);
    }
  };

  const handleFaviconSrc = (src, link) => {
    if (!src) return "";
    if (src === "") return "";
    if (src?.startsWith("data:image")) return src;
    if (src?.match(/^(ftp|http|https):\/\/[^ "]+$/)) return src;
    let domain = link.split("/")[2];
    return "https://" + domain + src;
  };

  const handlePreviewImageShow = (index) => {
    setPreview((prev) => ({
      ...prev,
      previewImages: {
        ...prev.previewImages,
        value: prev.previewImages.value.map((image, i) => ({
          ...image,
          show: i === index ? !image.show : image.show,
        })),
      },
    }));
  };

  useEffect(() => {
    if (!currentField?.config?.preview) return;
    handlePreview();
  }, [link, currentField?.config?.preview]);

  return (
    <form
      onSubmit={handleSave}
      className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md"
    >
      <div className="w-full flex justify-center items-center p-1">
        <span className="w-3 h-3 flex justify-center items-center">
          <LinkIcon />
        </span>
        <input
          type="text"
          autoFocus={true}
          placeholder="Link"
          value={link}
          onChange={handleLinkChange}
          required
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
      </div>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          Loading Preview...
        </div>
      ) : (
        currentField?.config?.preview && (
          <div className="w-full h-fit flex justify-center items-center flex-col p-1">
            {preview?.favicon && (
              <div className="w-full flex justify-start items-center gap-1 ">
                {preview?.favicon?.show && (
                  <img
                    src={handleFaviconSrc(preview.favicon.value, link)}
                    alt="favicon"
                    className="w-5 h-5 rounded-full"
                  />
                )}
                {preview?.siteName?.show && (
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {preview.siteName.value}
                  </span>
                )}
              </div>
            )}
            {preview?.title?.show && (
              <h1 className="w-full text-[var(--text-primary)]  text-sm font-medium">
                {preview.title.value}
              </h1>
            )}
            {preview?.description?.show && (
              <p className="w-full text-start text-[var(--text-primary)] text-xs">
                {preview.description.value}
              </p>
            )}
            {preview?.previewImages?.show &&
              preview?.previewImages?.value?.length > 0 &&
              preview?.previewImages?.value?.map((image, i) => (
                <div
                  key={`preview-image-${currentField?.id}-${i}-`}
                  className="w-full h-fit relative flex justify-center items-center"
                >
                  <img
                    src={image?.url}
                    alt="preview"
                    className="mt-2 rounded-md object-contain"
                  />
                  <div className="absolute bottom-0 right-0 w-fit h-fit flex justify-center items-center">
                    <button
                      type="button"
                      onClick={() => handlePreviewImageShow(i)}
                      className="w-6 h-6 flex justify-center items-center bg-[var(--bg-tertiary)] p-1 rounded-tl-md transition-colors duration-300"
                      title="Show This Image"
                    >
                      {image?.show ? <CheckedIcon /> : <UncheckedIcon />}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )
      )}
      {!isValidLink && (
        <span className="text-[var(--btn-delete)] text-xs font-bold">
          Enter a Valid Link!
        </span>
      )}
      <InputTitleButtons
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        handleSave={handleSave}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
        linkPreviewLoading={loading}
        linkPreview={preview}
        setLinkPreview={setPreview}
      />
    </form>
  );
};
