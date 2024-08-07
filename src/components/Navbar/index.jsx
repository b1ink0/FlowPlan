import React, { useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { useToggleTheme } from "../../hooks/useToggleTheme";
import ThemeIcon from "../../assets/Icons/ThemeIcon";
import SettingsIcon from "../../assets/Icons/SettingsIcon";
import BackgroundIcon from "../../assets/Icons/BackgroundIcon";
import SelectedIcon from "../../assets/Icons/SelectedIcon";
import BackIcon from "../../assets/Icons/BackIcon";
import ResetToDefaultIcon from "../../assets/Icons/ResetToDefaultIcon";
import useClickOutside from "../../hooks/useClickOutside";
import { useAuth } from "../../context/AuthContext";
import CloudIcon from "../../assets/Icons/CloudIcon";
import { useDatabase } from "../../hooks/useDatabase";
import ComponetSpinner from "../Helpers/ComponentSpinner";

function Navbar() {
  const {
    ref: settingsRef,
    isActive: isSettingsVisible,
    setIsActive: setIsSettingsVisible,
  } = useClickOutside(false);
  const { setMove, settings, setSettings, updatingDatabase } =
    useStateContext();
  const { handleSync } = useDatabase();
  const { toggleColorScheme } = useToggleTheme();

  const handleSettingsToggle = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

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

  return (
    <div className="z-10 absolute top-2 right-0 rounded-sm w-fit h-10 text-gray-200 flex justify-center items-center gap-2 px-3 py-2">
      <button
        className="w-fit shrink-0 h-8 rounded-md bg-[var(--bg-secondary)] p-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
        onClick={toggleColorScheme}
      >
        <ThemeIcon />
      </button>
      <button
        className="w-fit shrink-0 h-8 rounded-md bg-[var(--bg-secondary)] p-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
        onClick={handleSync}
      >
        {updatingDatabase.updating ? (
          <ComponetSpinner>
            <CloudIcon />
          </ComponetSpinner>
        ) : (
          <CloudIcon />
        )}
      </button>
      <span ref={settingsRef} className="relative w-8 h-8">
        <button
          className="relative w-8 h-8 rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
          onClick={handleSettingsToggle}
        >
          <SettingsIcon />
        </button>
        {isSettingsVisible && <Settings />}
      </span>
      <select
        value={settings.treeConfig.renderType}
        onChange={handleRenderType}
        className="text-[var(--text-primary)] w-fit h-8 rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
      >
        <option
          className="text-[var(--text-primary)] bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
          value="verticalTree"
        >
          Vertical Tree ∨
        </option>
        <option
          className="text-[var(--text-primary)] bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
          value="horizontalTree"
        >
          Horizontal Tree &gt;
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

const Settings = () => {
  const [setshowSettings, setSetshowSettings] = useState({
    background: false,
    saveTransforms: false,
    autoSync: false,
  });

  const { currentUser } = useAuth();
  const handleShow = (type) => {
    setSetshowSettings({
      ...setshowSettings,
      [type]: !setshowSettings[type],
    });
  };
  return (
    <div className="absolute flex flex-col gap-1 top-10 left-0 w-[200px] h-fit bg-[var(--bg-primary)] border-2 border-[var(--border-primary)] rounded-md px-1 py-1 text-[var(--text-primary)]">
      <button
        className="w-full flex justify-between items-center rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
        onClick={() => handleShow("background")}
      >
        Background
        <span className="w-5 h-8">
          <BackgroundIcon />
        </span>
      </button>
      {setshowSettings.background && <BackgroundSettings />}
      <button
        className="w-full flex justify-between items-center rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
        onClick={() => handleShow("saveTransforms")}
      >
        Save Transforms
        <span className="w-5 h-8">
          <ResetToDefaultIcon />
        </span>
      </button>
      {setshowSettings.saveTransforms && <SaveTransforms />}

      {currentUser && (
        <button
          className="w-full flex justify-between items-center rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
          onClick={() => handleShow("autoSync")}
        >
          DB Auto Sync
          <span className="w-5 h-8">
            <CloudIcon />
          </span>
        </button>
      )}
      {setshowSettings.autoSync && <AutoSync />}
    </div>
  );
};

const BackgroundSettings = () => {
  const {
    currentGlobalBackground,
    setCurrentGlobalBackground,
    globalBackgrounds,
    setGlobalBackgrounds,
  } = useStateContext();

  const handleUpdateCurrentGlobalBackground = (background) => {
    setCurrentGlobalBackground(background);
    localStorage.setItem("currentGlobalBackground", JSON.stringify(background));
  };
  const [index, setIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const nextBackground = () => {
    if (globalBackgrounds.length - 1 === index) return;
    setIndex((prevIndex) => (prevIndex + 1) % globalBackgrounds.length);
    scrollContainerRef.current.scrollLeft += 100; // Adjust the scroll distance as needed
  };

  const prevBackground = () => {
    if (index === 0) return;
    setIndex(
      (prevIndex) =>
        (prevIndex - 1 + globalBackgrounds.length) % globalBackgrounds.length
    );
    scrollContainerRef.current.scrollLeft -= 100; // Adjust the scroll distance as needed
  };

  return (
    <div className="w-full h-fit overflow-hidden rounded-md bg-[var(--bg-primary)] border-2 border-[var(--border-primary)]">
      <div
        ref={scrollContainerRef}
        className="small-scroll-bar snap-mandatory snap-x flex shrink-0 overflow-x-auto pb-2 relative"
      >
        {globalBackgrounds.map((background, index) => (
          <div
            key={"background-" + index}
            className="snap-center shrink-0 w-full h-[80px] cursor-pointer flex justify-center items-center relative"
          >
            <div
              className="shrink-0 w-full h-[80px] cursor-pointer flex justify-center items-center relative"
              style={{
                backgroundImage: background.backgroundImage,
                backgroundRepeat: background.backgroundRepeat,
                backgroundSize: background.backgroundSize,
                backgroundPosition: background.backgroundPosition,
                opacity: background.opacity,
              }}
              onClick={() => handleUpdateCurrentGlobalBackground(background)}
            ></div>
            {background.backgroundImage ===
              currentGlobalBackground.backgroundImage && (
              <span className="absolute w-10 h-10 bg-[var(--bg-secondary)] opacity-70">
                <SelectedIcon />
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col text-sm p-1 gap-1">
        <div className="flex justify-between items-center gap-2 rounded-md">
          <button
            className="w--8 h-6 flex justify-center items-center  rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
            onClick={prevBackground}
            disabled={index === 0 ? true : false}
          >
            <span className="flex justify-center items-center w-4 h-5 rotate-180">
              <BackIcon />
            </span>
          </button>
          <div>
            {
              globalBackgrounds.map((background, index) => (
                <span
                  key={"background-" + index}
                  className={`w-3 h-3 rounded-full inline-block ${
                    background.backgroundImage ===
                    currentGlobalBackground.backgroundImage
                      ? "bg-[var(--logo-primary)]"
                      : "bg-[var(--bg-secondary)]"
                  }`}
                ></span>
              ))[index]
            }
          </div>
          <button
            className="w-8 h-6 rounded-md bg-[var(--bg-secondary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)]"
            onClick={nextBackground}
            disabled={globalBackgrounds.length === index ? true : false}
          >
            <span className="flex justify-center items-center w-4 h-5">
              <BackIcon />
            </span>
          </button>
        </div>
        <div className="flex justify-between  items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">Opacity:</span>
          <input
            type="number"
            minLength={0}
            maxLength={100}
            value={currentGlobalBackground.opacity * 100}
            onChange={(e) =>
              handleUpdateCurrentGlobalBackground({
                ...currentGlobalBackground,
                opacity:
                  e.target.value >= 0 && e.target.value <= 100
                    ? e.target.value / 100
                    : currentGlobalBackground.opacity,
              })
            }
            className="w-[80px] h-6 rounded-md bg-[var(--bg-primary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          />
        </div>
        <div className="flex justify-between items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">BG Size:</span>
          <input
            type="text"
            value={currentGlobalBackground.backgroundSize}
            onChange={(e) =>
              handleUpdateCurrentGlobalBackground({
                ...currentGlobalBackground,
                backgroundSize: e.target.value,
              })
            }
            className="w-[80px] h-6 rounded-md bg-[var(--bg-primary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          />
        </div>
        <div className="flex justify-between items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">BG Repeat:</span>
          <select
            value={currentGlobalBackground.backgroundRepeat}
            onChange={(e) =>
              handleUpdateCurrentGlobalBackground({
                ...currentGlobalBackground,
                backgroundRepeat: e.target.value,
              })
            }
            className="w-[80px] text-xs h-6 rounded-md bg-[var(--bg-primary)] px-1 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          >
            <option value="repeat">Repeat</option>
            <option value="no-repeat">No Repeat</option>
            <option value="repeat-x">Repeat X</option>
            <option value="repeat-y">Repeat Y</option>
          </select>
        </div>
        <div className="flex justify-between items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">BG Position:</span>
          <select
            value={currentGlobalBackground.backgroundPosition}
            onChange={(e) =>
              handleUpdateCurrentGlobalBackground({
                ...currentGlobalBackground,
                backgroundPosition: e.target.value,
              })
            }
            className="w-[80px] text-xs h-6 rounded-md bg-[var(--bg-primary)] px-1 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          >
            <option value="center">Center</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const SaveTransforms = () => {
  const { settings, setSettings } = useStateContext();
  const { treeConfig } = settings;
  const handleUpdateUseSavedTransformState = () => {
    const value =
      treeConfig?.useSavedTransformState === "true" ? "false" : "true";
    setSettings({
      ...settings,
      treeConfig: { ...settings.treeConfig, useSavedTransformState: value },
    });
    localStorage.setItem("useSavedTransformState", value);
  };
  return (
    <div className="w-full h-fit overflow-hidden rounded-md bg-[var(--bg-primary)] border-2 border-[var(--border-primary)]">
      <div className="flex flex-col text-sm p-1 gap-1">
        <div className="flex justify-between items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">Save</span>
          <span
            onClick={handleUpdateUseSavedTransformState}
            className="cursor-pointer flex justify-start items-center w-7 h-3 rounded-md bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          >
            <span
              style={{
                transform:
                  treeConfig?.useSavedTransformState === "true"
                    ? "translateX(18px)"
                    : "translateX(2px)",
              }}
              className="block w-2 h-2 rounded-md bg-[var(--logo-primary)] transition-transform"
            ></span>
          </span>
        </div>
      </div>
    </div>
  );
};

const AutoSync = () => {
  const { settings, setSettings } = useStateContext();
  const { databaseConfig } = settings;
  const handleUpdateUseSavedTransformState = (type) => {
    const value = databaseConfig[type] === "true" ? "false" : "true";
    setSettings({
      ...settings,
      databaseConfig: { ...settings.databaseConfig, [type]: value },
    });
    localStorage.setItem(type, value);
  };
  return (
    <div className="w-full h-fit overflow-hidden rounded-md bg-[var(--bg-primary)] border-2 border-[var(--border-primary)]">
      <div className="flex flex-col text-sm p-1 gap-1">
        <div className="flex justify-between items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">Auto Sync</span>
          <span
            onClick={() => handleUpdateUseSavedTransformState("autoSync")}
            className="cursor-pointer flex justify-start items-center w-7 h-3 rounded-md bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          >
            <span
              style={{
                transform:
                  databaseConfig?.autoSync === "true"
                    ? "translateX(18px)"
                    : "translateX(2px)",
              }}
              className="block w-2 h-2 rounded-md bg-[var(--logo-primary)] transition-transform"
            ></span>
          </span>
        </div>
        <div className="flex justify-between items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">Show Log</span>
          <span
            onClick={() => handleUpdateUseSavedTransformState("showLog")}
            className="cursor-pointer flex justify-start items-center w-7 h-3 rounded-md bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          >
            <span
              style={{
                transform:
                  databaseConfig?.showLog === "true"
                    ? "translateX(18px)"
                    : "translateX(2px)",
              }}
              className="block w-2 h-2 rounded-md bg-[var(--logo-primary)] transition-transform"
            ></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
