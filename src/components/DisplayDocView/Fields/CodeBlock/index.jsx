import { useStateContext } from "../../../../context/StateContext.jsx";
import { useFunctions } from "../../../../hooks/useFunctions/index.jsx";
import * as Themes from "react-syntax-highlighter/dist/cjs/styles/prism/index.js";
import * as Languages from "react-syntax-highlighter/dist/cjs/languages/prism/index.js";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import CopyIcon from "../../../../assets/Icons/CopyIcon.jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import LinewrapIcon from "../../../../assets/Icons/LinewrapIcon.jsx";
import NumberListIcon from "../../../../assets/Icons/NumberListIcon.jsx";
import TopbarIcon from "../../../../assets/Icons/TopbarIcon.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const CodeBlock = ({
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
  const { copyToClipboard } = useFunctions();
  const allThemes = Object.keys(Themes);
  const allLanguages = Object.keys(Languages);
  const [theme, setTheme] = useState(
    currentField?.data?.code?.theme ?? "dracula"
  );
  const [language, setLanguage] = useState(
    currentField?.data?.code?.language ?? "javascript"
  );
  const textareaRef = useRef(null);
  const handleParaChange = (e) => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          string: e.target.value,
        },
      },
    });
  };

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the new height
    }
  };
  const { handleUpdateIndexDB } = useDatabase();

  const handleChangeLanguageSelect = (e) => {
    let language = e.target.value;
    setLanguage(language);
  };

  const handleChangeThemeSelect = (e) => {
    let theme = e.target.value;
    setTheme(theme);
  };

  const handleLineNumbers = () => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          lineNumbers: !currentField?.data?.code?.lineNumbers,
        },
      },
    });
  };

  const handleWrapLines = () => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          wrapLines: !currentField?.data?.code?.wrapLines,
        },
      },
    });
  };

  const handleHideTop = () => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          hideTop: !currentField?.data?.code?.hideTop,
        },
      },
    });
  };

  const handleDelete = async (index) => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    node.data.splice(index, 1);
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    if (currentField?.data?.code?.string === "") return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          language: language,
          theme: theme,
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
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  useEffect(() => {
    handleTextareaChange();
  }, [currentField?.data?.code?.string]);

  return (
    <div className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md p-1">
      {!currentField?.data?.code?.hideTop && (
        <div className="w-full h-fit text-xs text-[var(--text-primary)] flex justify-between items-center gap-2 flex-wrap py-1 px-2 bg-[var(--bg-tertiary)] rounded-t-md">
          <span>{language ?? "javascript"}</span>
          <button
            onClick={() => copyToClipboard(currentField?.data?.code?.string)}
            className="w-6 h-6 p-1 flex justify-center items-center hover:bg-[var(--bg-secondary)] rounded-md bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            title="Copy Code"
          >
            <span className="w-full h-full flex justify-center items-center">
              <CopyIcon />
            </span>
          </button>
        </div>
      )}
      <SyntaxHighlighter
        customStyle={{
          width: "100%",
          margin: "0px",
          padding: "3px",
          borderRadius: currentField?.data?.code?.hideTop
            ? "5px"
            : "0px 0px 5px 5px",
        }}
        className="small-scroll-bar"
        showLineNumbers={currentField?.data?.code?.lineNumbers ?? false}
        showInlineLineNumbers={currentField?.data?.code?.lineNumbers ?? false}
        wrapLines={true}
        wrapLongLines={true}
        language={language}
        style={Themes[theme] ?? Themes["dracula"]}
      >
        {currentField?.data?.code?.string !== ""
          ? currentField?.data?.code?.string
          : "// Example\nconsole.log('Hello World')"}
      </SyntaxHighlighter>
      <textarea
        type="text"
        autoFocus={true}
        placeholder="Enter Code..."
        value={currentField?.data?.code?.string ?? ""}
        onChange={handleParaChange}
        required
        className="mt-2 w-full h-fit bg-[var(--bg-secondary)] p-1 text-[var(--text-primary)] text-sm outline-none transition-colors duration-300 cursor-pointer resize-none border-2 border-[var(--border-primary)] rounded-md small-scroll-bar whitespace-nowrap"
        ref={textareaRef}
      />
      <div className="w-full flex justify-center items-center gap-2 flex-wrap mt-2">
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentFieldType(null);
            setCurrentField(null);
          }}
        >
          Cancel
        </button>
        <select
          title="Code Block Languages"
          className="w-20 group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
          value={language}
          onChange={handleChangeLanguageSelect}
        >
          {allLanguages?.map((language) => (
            <option key={`code-language-${language}`} value={language}>
              {language}
            </option>
          ))}
        </select>
        <button
          onClick={handleWrapLines}
          className="relative w-8 h-8 px-[4px] text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          title="Wrap Lines"
        >
          <span className="">
            <LinewrapIcon />
          </span>
          {!currentField?.data?.code?.wrapLines && (
            <span className="absolute w-8 h-[2px] rounded-full bg-[var(--logo-primary)] -rotate-45"></span>
          )}
        </button>
        <select
          title="Code Block Themes"
          className="w-20 group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
          value={theme}
          onChange={handleChangeThemeSelect}
        >
          {allThemes?.map((theme) => (
            <option key={`code-theme-${theme}`} value={theme}>
              {theme}
            </option>
          ))}
        </select>
        <button
          onClick={handleLineNumbers}
          title="Line Numbers"
          className="relative w-8 h-8 px-[6px] text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
        >
          <span className="">
            <NumberListIcon />
          </span>
          {!currentField?.data?.code?.lineNumbers && (
            <span className="absolute w-8 h-[2px] rounded-full bg-[var(--logo-primary)] -rotate-45"></span>
          )}
        </button>
        <button
          title="Toggle Topbar"
          className="w-8 h-8 px-1 relative text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={handleHideTop}
        >
          <span className="">
            <TopbarIcon />
          </span>
          {currentField?.data?.code?.hideTop && (
            <span className="absolute w-8 h-[2px] rounded-full bg-[var(--logo-primary)] -rotate-45"></span>
          )}
        </button>

        {currentField?.id && (
          <button
            className="w-8 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={() => handleDelete(currentField?.index)}
          >
            <span className="">
              <DeleteIcon />
            </span>
          </button>
        )}
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={(e) => handleSave(e, currentField?.index)}
        >
          Save
        </button>
      </div>
    </div>
  );
};
