import React, { useEffect, useState } from "react";
import { ImageWithPlaceholder } from "../../Helpers/ImageWithPIaceholder/index.jsx";

export const LinkView = ({ link, previewLink }) => {
  const [previewInfo, setPreviewInfo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    setPreview(null);
    setLoading(true);

    if (link === "") return;
    try {
      const url = "https://get-website-preview.vercel.app" + "?link=" + link;
      const data = await fetch(url, {
        method: "GET",
      });
      let res = await data.json();
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
              value: res.data[key].map((image, i) => ({
                url: image,
                show: previewLink[key]?.value?.[i]?.show ?? true,
              })),
              show: previewLink[key]?.show || true,
            };
          } else {
            tempPreview[key] = {
              value: res.data[key],
              show: previewLink[key]?.show || true,
            };
          }
        }
      });
      setPreview(tempPreview);
      if (Object.keys(previewLink).length === 0) {
        setPreviewInfo(tempPreview);
      }
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

  useEffect(() => {
    setPreviewInfo(previewLink);
    handlePreview();
    console.log(previewLink);
  }, [link, previewLink]);

  return (
    <div className="w-full h-fit flex justify-center items-center flex-col">
      {loading ? (
        <>
          {previewInfo?.favicon && (
            <div className="w-full flex justify-start items-center gap-1 ">
              {previewInfo?.favicon?.show && (
                <img
                  src={handleFaviconSrc(previewInfo.favicon?.value, link)}
                  alt="favicon"
                  className="w-5 h-5 rounded-full"
                />
              )}
              {previewInfo?.siteName?.show && (
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {previewInfo.siteName?.value}
                </span>
              )}
            </div>
          )}
          {previewInfo?.title?.show && (
            <h1 className="w-full text-[var(--text-primary)]  text-sm font-medium">
              {previewInfo.title?.value}
            </h1>
          )}
          {previewInfo?.description?.show && (
            <p className="w-full text-[var(--text-primary)] text-xs text-start">
              {previewInfo.description?.value}
            </p>
          )}
          {previewInfo?.previewImages?.show &&
            previewInfo?.previewImages?.value?.length > 0 &&
            previewInfo.previewImages?.value.map((image, i) =>
              image?.show ? (
                <div
                  key={`preview-image-${i}-${image.url}`}
                  className="w-full h-fit relative flex justify-center items-center overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt="Preview Image"
                    className="mt-2 rounded-md object-contain"
                  />
                </div>
              ) : null
            )}
        </>
      ) : (
        <>
          {(preview?.favicon || preview?.siteName) && (
            <div className="w-full flex justify-start items-center gap-1 ">
              {previewInfo?.favicon?.show && (
                <img
                  src={handleFaviconSrc(preview?.favicon?.value, link)}
                  alt="favicon"
                  className="w-5 h-5 rounded-full"
                />
              )}
              {previewInfo?.siteName?.show && (
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {preview?.siteName?.value}
                </span>
              )}
            </div>
          )}
          {previewInfo?.title?.show && (
            <h1 className="w-full text-[var(--text-primary)]  text-sm font-medium">
              {preview?.title?.value}
            </h1>
          )}
          {previewInfo?.description?.show && (
            <p className="w-full text-[var(--text-primary)] text-xs text-start">
              {preview?.description?.value}
            </p>
          )}
          {previewInfo?.previewImages?.show &&
            preview?.previewImages?.value?.length > 0 &&
            preview?.previewImages?.value?.map((image, i) =>
              image?.show ? (
                <div
                  key={`preview-image-${i}-${image?.url}`}
                  className="w-full h-fit relative flex justify-center items-center overflow-hidden"
                >
                  <ImageWithPlaceholder
                    key={`preview-image-${i}`}
                    src={image?.url}
                    placeholderSrc={preview?.favicon?.value}
                    alt="preview"
                  />
                </div>
              ) : null
            )}
        </>
      )}
    </div>
  );
};
