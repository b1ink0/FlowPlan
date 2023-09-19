import React from "react";
import { useStateContext } from "../../context/StateContext";
import { useToggleTheme } from "../../hooks/useToggleTheme";
import ThemeIcon from "../../assets/Icons/ThemeIcon";

function Navbar() {
  const { setMove, settings, setSettings } = useStateContext();
  const { toggleColorScheme } = useToggleTheme();
  const handleRenderType = (e) => {
    setSettings({
      ...settings,
      nodeConfig: {
        ...settings.nodeConfig,
        nodeHeightMargin: e.target.value === "verticalTree" ? 100 : 130,
      },
      treeConfig: { ...settings.treeConfig, renderType: e.target.value },
    });
    setMove({
      enable: false,
      node: null,
    });
    localStorage.setItem("renderType", e.target.value);
  };
  return (
    <div className="z-10 absolute top-2 right-0 rounded-sm w-fit h-10 text-gray-200 flex justify-center items-center gap-3 px-3 py-2">
      <button
        className="w-fit h-8 rounded-md bg-[var(--bg-quaternary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
        onClick={toggleColorScheme}
      >
        <ThemeIcon />
      </button>
      <select
        value={settings.treeConfig.renderType}
        onChange={handleRenderType}
        className="text-[var(--text-primary)] w-fit h-8 rounded-md bg-[var(--bg-quaternary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
      >
        <option
          className="text-[var(--text-primary)] bg-[var(--bg-quaternary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
          value="verticalTree"
        >
          Vertical Tree
        </option>
        <option
          className="text-[var(--text-primary)] bg-[var(--bg-quaternary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
          value="horizontalTree"
        >
          Horizontal Tree
        </option>
      </select>
      <input
        type="text"
        placeholder="Search Ctrl+K"
        className="text-[var(--text-primary)] w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
      />
    </div>
  );
}

export default Navbar;
