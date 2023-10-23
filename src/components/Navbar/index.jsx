import React, { useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { useToggleTheme } from "../../hooks/useToggleTheme";
import ThemeIcon from "../../assets/Icons/ThemeIcon";
import { useFunctions } from "../../hooks/useFunctions";

function Navbar() {
  const { currentFlowPlan, setMove, settings, setSettings } = useStateContext();
  const { toggleColorScheme } = useToggleTheme();
  const { searchDeepObject } = useFunctions();
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");

  const handleRenderType = (e) => {
    setSettings({
      ...settings,
      treeConfig: { ...settings.treeConfig, renderType: e.target.value },
    });
    setMove({
      enable: false,
      node: null,
    });
    localStorage.setItem("renderType", e.target.value);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setSearchResults([]);
    } else {
      const results = searchDeepObject(currentFlowPlan?.root, e.target.value);
      console.log(results);
      setSearchResults(results);
    }
  };

  return (
    <div className="z-10 absolute top-2 right-0 rounded-sm w-fit h-10 text-gray-200 flex justify-center items-center gap-3 px-3 py-2">
      <button
        className="w-fit h-8 py-[6px] rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
        onClick={toggleColorScheme}
      >
        <ThemeIcon />
      </button>
      <select
        value={settings.treeConfig.renderType}
        onChange={handleRenderType}
        className="text-[var(--text-primary)] w-fit h-8 rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
      >
        <option
          className="text-[var(--text-primary)] bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
          value="verticalTree"
        >
          Vertical Tree
        </option>
        <option
          className="text-[var(--text-primary)] bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
          value="horizontalTree"
        >
          Horizontal Tree
        </option>
      </select>
      <div className="relative flex flex-col gap-1">
        <input
          type="text"
          placeholder="Search Ctrl+K"
          value={search}
          onChange={handleSearch}
          className="text-[var(--text-primary)] w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
        />
        <div className="absolute top-10 left-0 w-full bg-[var(--bg-secondary)] rounded-md shadow-md border-2 border-[var(--border-primary)]">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="px-2 py-1 hover:bg-[var(--bg-tertiary)] cursor-pointer border-b-2 border-[var(--border-primary)] "
            >
              {result.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
