import React, { useEffect } from "react";
import { useStateContext } from "../../context/StateContext";
import AddIcon from "../../assets/Icons/AddIcon";
import { v4 } from "uuid";

function SharedMenu() {
  const { shared } = useStateContext();
  const { sharedData, setSharedData, sharedQuickAccess, setCopyField } =
    useStateContext();

  const handleIsLinkValid = () => {
    const regex = new RegExp(/^(http|https):\/\/[^ "]+$/, "gi");
    if (regex.test(shared.title)) {
      return "title";
    } else if (regex.test(shared.text)) {
      return "text";
    } else if (regex.test(shared.url)) {
      return "url";
    } else {
      return false;
    }
  };

  const handlePreview = async (link) => {
    if (link === "") return false;
    try {
      const url = "https://get-website-preview.vercel.app" + "?link=" + link;
      const data = await fetch(url, {
        method: "GET",
        // mode: "no-cors",
      });
      let res = await data.json();
      console.log(res);
      if (!res.success) {
        return false;
      }
      let tempPreview = {};
      Object.keys(res.data).forEach((key) => {
        if (res.data[key] !== "") {
          if (key === "previewImages") {
            tempPreview[key] = {
              value: res.data[key].map((image, i) => {
                return {
                  url: image,
                  show: true,
                };
              }),
              show: true,
            };
          } else {
            tempPreview[key] = {
              value: res.data[key],
              show: true,
            };
          }
        }
      });

      return tempPreview;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const handleInit = async () => {
    const isValid = handleIsLinkValid();
    if (isValid) {
      setSharedData((prev) => ({
        ...prev,
        link: true,
        url: shared[isValid],
        title: isValid !== "title" ? shared.title : null,
      }));

      const field = {
        type: "link",
        data: {
          text: "",
          list: [],
          taskList: {
            repeat: {
              data: [],
              format: {
                type: "daily",
                des: "Daily",
              },
              custom: [
                {
                  type: "monday",
                  des: "Monday",
                  shortDes: "Mon",
                  checked: true,
                },
                {
                  type: "tuesday",
                  des: "Tuesday",
                  shortDes: "Tue",
                  checked: true,
                },
                {
                  type: "wednesday",
                  des: "Wednesday",
                  shortDes: "Wed",
                  checked: true,
                },
                {
                  type: "thursday",
                  des: "Thursday",
                  shortDes: "Thu",
                  checked: true,
                },
                {
                  type: "friday",
                  des: "Friday",
                  shortDes: "Fri",
                  checked: true,
                },
                {
                  type: "saturday",
                  des: "Saturday",
                  shortDes: "Sat",
                  checked: true,
                },
                {
                  type: "sunday",
                  des: "Sunday",
                  shortDes: "Sun",
                  checked: true,
                },
              ],
            },
          },
          link: shared[isValid],
          image: {
            name: "",
            url: "",
            mimeType: "",
          },
          file: {
            name: "",
            url: "",
            mimeType: "",
          },
          table: [
            {
              type: "head",
              data: [
                {
                  text: "Heading 1",
                },
                {
                  text: "Heading 2",
                },
              ],
            },
            {
              type: "body",
              data: [
                {
                  text: "",
                },
                {
                  text: "",
                },
              ],
            },
          ],
          timestamp: {
            string: "",
            iso: "2024-07-08T20:46:45.565Z",
            format: {
              type: "Date Only",
              input: {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              },
            },
          },
          code: {
            language: "javascript",
            theme: "dracula",
            lineNumbers: true,
            wrapLines: true,
            string: "",
            hideTop: false,
          },
          progress: {
            progress: 0,
            type: "doc",
            list: [],
          },
          duration: {
            start: "2024-07-08T20:46:45.565Z",
            end: null,
            format: {
              type: "Date and Time (12-Hour)",
              input: {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              },
            },
          },
          durationEnd: {
            durationId: null,
          },
          durationTimeline: {
            type: "doc",
            format: {
              type: "Date and Time (12-Hour)",
              input: {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              },
            },
            displayFormat: {
              type: "week",
              des: "Week",
            },
          },
        },
        config: {
          fontSize: 14,
          strickthrough: false,
          italic: false,
          bold: false,
          color: "#94edff",
          fontFamily: "var(--font-primary)",
          align: "left",
          preview: true,
        },
        id: v4(),
      };

      const preview = await handlePreview(shared[isValid]);
      if (preview) {
        field.data.previewLink = preview;
      }
      setSharedData((prev) => ({
        ...prev,
        link: true,
        title: shared.title !== shared[isValid] ? shared.title : null,
        text: shared.text !== shared[isValid] ? shared.text : null,
        url: shared[isValid],
      }));

      setCopyField(field);
    } else {
      const field = {
        type: "paragraph",
        data: {
          text: `# ${shared.title}\n${shared.text}`,
          list: [],
          taskList: {
            repeat: {
              data: [],
              format: {
                type: "daily",
                des: "Daily",
              },
              custom: [
                {
                  type: "monday",
                  des: "Monday",
                  shortDes: "Mon",
                  checked: true,
                },
                {
                  type: "tuesday",
                  des: "Tuesday",
                  shortDes: "Tue",
                  checked: true,
                },
                {
                  type: "wednesday",
                  des: "Wednesday",
                  shortDes: "Wed",
                  checked: true,
                },
                {
                  type: "thursday",
                  des: "Thursday",
                  shortDes: "Thu",
                  checked: true,
                },
                {
                  type: "friday",
                  des: "Friday",
                  shortDes: "Fri",
                  checked: true,
                },
                {
                  type: "saturday",
                  des: "Saturday",
                  shortDes: "Sat",
                  checked: true,
                },
                {
                  type: "sunday",
                  des: "Sunday",
                  shortDes: "Sun",
                  checked: true,
                },
              ],
            },
          },
          link: "",
          image: {
            name: "",
            url: "",
            mimeType: "",
          },
          file: {
            name: "",
            url: "",
            mimeType: "",
          },
          table: [
            {
              type: "head",
              data: [
                {
                  text: "Heading 1",
                },
                {
                  text: "Heading 2",
                },
              ],
            },
            {
              type: "body",
              data: [
                {
                  text: "",
                },
                {
                  text: "",
                },
              ],
            },
          ],
          timestamp: {
            string: "",
            iso: "2024-07-08T21:04:35.279Z",
            format: {
              type: "Date Only",
              input: {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              },
            },
          },
          code: {
            language: "javascript",
            theme: "dracula",
            lineNumbers: true,
            wrapLines: true,
            string: "",
            hideTop: false,
          },
          progress: {
            progress: 0,
            type: "doc",
            list: [],
          },
          duration: {
            start: "2024-07-08T21:04:35.279Z",
            end: null,
            format: {
              type: "Date and Time (12-Hour)",
              input: {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              },
            },
          },
          durationEnd: {
            durationId: null,
          },
          durationTimeline: {
            type: "doc",
            format: {
              type: "Date and Time (12-Hour)",
              input: {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              },
            },
            displayFormat: {
              type: "week",
              des: "Week",
            },
          },
        },
        config: {
          fontSize: 16,
          strickthrough: false,
          italic: false,
          bold: false,
          color: "var(--text-primary)",
          fontFamily: "var(--font-primary)",
          align: "left",
        },
        id: v4(),
      };

      setCopyField(field);
      setSharedData((prev) => ({
        ...prev,
        link: false,
        title: shared.title,
        text: shared.text,
      }));
    }
  };
  useEffect(() => {
    handleInit();
  }, [shared]);

  return (
    (sharedData.link || sharedData.title || sharedData.text) &&
    sharedData.showMenu && (
      <div className="absolute w-[400px] max-md:w-11/12 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-primary)] rounded-md z-50 p-2">
        <button
          className="absolute top-1 right-1 w-5 h-6 rotate-45"
          onClick={() =>
            setSharedData((prev) => ({ ...prev, showMenu: false }))
          }
        >
          <AddIcon />
        </button>
        <div className="w-full flex flex-col justify-between items-start gap-1">
          <h3 className="text-md font-semibold">Shared Data</h3>
          {sharedData.title && <h2>Title: {sharedData.title}</h2>}
          {sharedData.text && <p>Text: {sharedData.text}</p>}
          {sharedData.link && (
            <span
              className="text-[var(--btn-move)] text-sm break-all
                bg-[var(--bg-primary)] p-1 rounded-md w-full
            "
            >
              <a
                className="hover:underline"
                href={sharedData.url}
                target="_blank"
                rel="noreferrer"
              >
                {sharedData.url}
              </a>
            </span>
          )}
          <hr className="w-full border-[var(--border-primary)] my-2" />

          <div className="w-full flex flex-col justify-center items-start gap-1">
            <h4 className="text-base font-semibold">Quick Access:</h4>
            {sharedQuickAccess.length === 0 ? (
              <>
                <p className="text-sm text-[var(--text-primary)]">
                  No Document View found in quick access.
                </p>
                <h4 className="text-sm font-semibold mt-2">
                  To add Document View to quick access:
                </h4>
                <p className="text-sm text-[var(--text-primary)]">
                  ( Close this menu and navigate to the desired Document View
                  and click on settings icon in top bar and select "add to
                  shared quick access". )
                </p>
              </>
            ) : (
              <div className="w-full flex flex-col justify-center items-start gap-1">
                {sharedQuickAccess.map((item, index) => (
                  <button
                    key={index}
                    title={item.title}
                    className="flex justify-between items-center w-full p-1 border-2 border-[var(--border-primary)] rounded-md
                        bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors duration-300
                    "
                  >
                    <span className="truncate">{item.title}</span>
                    <span
                      className="w-5 h-5 shrink-0 text-[var(--text-primary)] hover:rotate-90 transition-transform duration-300"
                      onClick={() => console.log(item)}
                    >
                      <AddIcon />
                    </span>
                  </button>
                ))}
              </div>
            )}
            <hr className="w-full border-[var(--border-primary)] my-2" />
            <h4 className="text-sm font-semibold">
              To add data to custom Document View:
            </h4>
            <p className="text-sm text-[var(--text-primary)]">
              ( Close this menu and navigate to the desired Document View to add
              the shared data to the Document View by clicking the paste button.
              )
            </p>
          </div>
        </div>
      </div>
    )
  );
}

export default SharedMenu;
