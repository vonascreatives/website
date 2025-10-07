'use client';
import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const  ThemeSetting = () => {
  const { setTheme, theme } = useTheme();
  const [settingOpen, setSettingOpen] = React.useState(false);

  console.log('theme', theme);

  function handleOpenSetting() {
    setSettingOpen(!settingOpen);
  };
  return (
    <div
      className={`tp-theme-settings-area transition-3 ${
        settingOpen ? "settings-opened" : ""
      }`}
    >
      <div className="tp-theme-wrapper">
        <div className="tp-theme-header text-center">
          <h4 className="tp-theme-header-title">Settings</h4>
        </div>

        <div className="tp-theme-dir mb-20">
          <label className="tp-theme-dir-main" htmlFor="tp-dir-toggler">
            <span
              onClick={() => setTheme("dark")}
              className={`tp-theme-dir-rtl ${theme === "dark" ? "active" : ""}`}
            >
              Dark
            </span>
            <input type="checkbox" id="tp-dir-toggler" checked={theme === "dark"} readOnly />
            <i className="tp-theme-dir-slide"></i>
            <span
              onClick={() => setTheme("light")}
              className={`tp-theme-dir-ltr ${
                theme === "light" ? "active" : ""
              }`}
            >
              Light
            </span>
          </label>
        </div>

        <div className="tp-theme-settings">
          <div className="tp-theme-settings-wrapper">
            <div className="tp-theme-settings-open">
              <button
                className="tp-theme-settings-open-btn"
                onClick={handleOpenSetting}
                aria-label="Toggle theme settings"
              >
                <span className="tp-theme-settings-gear">
                  <Image
                    src="/assets/img/logo/vonas-icon.png"
                    alt="Vonas icon"
                    width={60}
                    height={60}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    priority
                  />
                </span>
                <span className="tp-theme-settings-close">
                  <i className="fa-regular fa-xmark"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ThemeSetting), {
  ssr: false
})
