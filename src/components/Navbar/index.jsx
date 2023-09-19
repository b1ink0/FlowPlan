import React from "react";
import { useStateContext } from "../../context/StateContext";

function Navbar() {
  const { setMove, settings, setSettings } = useStateContext();
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
    <div className="z-10 absolute top-2 right-0 rounded-sm w-fit h-10 text-gray-200 flex justify-center items-center gap-5 px-5 py-2">
      <select
        value={settings.treeConfig.renderType}
        onChange={handleRenderType}
        className="w-fit h-8 rounded-md bg-gray-800 text-gray-200 px-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
      >
        <option
          className="bg-gray-800 text-gray-200 px-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
          value="verticalTree"
        >
          Vertical Tree
        </option>
        <option
          className="bg-gray-800 text-gray-200 px-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
          value="horizontalTree"
        >
          Horizontal Tree
        </option>
      </select>
      <input
        type="text"
        placeholder="Search Ctrl+K"
        className=" w-full px-2 py-1 rounded-md bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
      />
    </div>
  );
}

export default Navbar;
