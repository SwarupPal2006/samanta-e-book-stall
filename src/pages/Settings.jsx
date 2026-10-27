
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,

  ShieldCheck,
  Globe,
  Info,
  ChevronRight,
  Settings as SettingsIcon,
  Languages,
} from "lucide-react";

import "../Styles/settings.css";
import Previous from "../services/previousButton";

const APP_VERSION = "1.0.0";

const Settings = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    return () => {
      document.body.classList.remove("dark");
    };
  }, [darkMode]);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  return (
    <div className={`settings-page ${darkMode ? "settings-dark" : ""}`}>
      <div className="settings-container">

{/* HEADER */}
<header className="settings-header">
  <div className="settings-back">
    <Previous />
  </div>

  <div className="settings-title">
    <h1>Settings</h1>
    <p>Make your experience feel like yours.</p>
  </div>
</header>

        {/* APPEARANCE */}
        <section className="settings-group">
          <h2 className="settings-group-title">Appearance</h2>

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-icon theme-icon">
                {darkMode ? (
                  <Moon size={21} />
                ) : (
                  <Sun size={21} />
                )}
              </div>

              <div className="settings-info">
                <h3>Theme</h3>
                <p>
                  {darkMode
                    ? "Enjoy a comfortable dark interface."
                    : "A clean and bright browsing experience."}
                </p>
              </div>

              <button
                type="button"
                className={`theme-switch ${darkMode ? "switch-on" : ""}`}
                role="switch"
                aria-checked={darkMode}
                aria-label="Toggle dark mode"
                onClick={() => setDarkMode((previous) => !previous)}
              >
                <span className="theme-switch-knob" />
              </button>
            </div>

            <div className="settings-divider" />

            {/* LANGUAGE */}
            <div className="settings-row">
              <div className="settings-icon language-icon">
                <Languages size={21} />
              </div>

              <div className="settings-info">
                <h3>Language</h3>
                <p>Choose your preferred language.</p>
              </div>

              <div className="language-select-wrap">
                <select
                  className="language-select"
                  value={language}
                  onChange={handleLanguageChange}
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* YOUR SPACE */}
        <section className="settings-group">
          <h2 className="settings-group-title">Your Space</h2>

          <div className="settings-card">
            <button
              type="button"
              className="settings-row settings-action"
              onClick={() => navigate("/wishlist")}
            >

              <div className="settings-info">
                <h3>Wishlist</h3>
                <p>Revisit your saved favourite items.</p>
              </div>

              <ChevronRight
                className="settings-chevron"
                size={20}
              />
            </button>
          </div>
        </section>

        {/* PRIVACY */}
        <section className="settings-group">
          <h2 className="settings-group-title">Privacy & Security</h2>

          <div className="settings-card">
            <a
              href="/privacy"
              className="settings-row settings-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="settings-icon privacy-icon">
                <ShieldCheck size={21} />
              </div>

              <div className="settings-info">
                <h3>Privacy Policy</h3>
                <p>Learn how your information is handled.</p>
              </div>

              <ChevronRight
                className="settings-chevron"
                size={20}
              />
            </a>
          </div>
        </section>

        {/* APP INFORMATION */}
        <section className="settings-group">
          <h2 className="settings-group-title">About</h2>

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-icon about-icon">
                <Info size={21} />
              </div>

              <div className="settings-info">
                <h3>Web App Version</h3>
                <p>You're using the latest displayed version.</p>
              </div>

              <span className="version-badge">
                v{APP_VERSION}
              </span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="settings-footer">
          <div className="settings-footer-mark">
            <Globe size={15} />
          </div>
          <p>Thoughtfully designed for your everyday needs.</p>
          <span>Version {APP_VERSION}</span>
        </footer>

      </div>
    </div>
  );
};

export default Settings;
