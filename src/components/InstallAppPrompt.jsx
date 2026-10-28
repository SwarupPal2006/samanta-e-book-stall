
import { useEffect, useState } from "react";
import {
  BookOpen,
  Download,
  Globe,
  X,
} from "lucide-react";
import "../Styles/InstallAppPrompt.css";

const DISMISSED_KEY = "samanta_install_prompt_dismissed";
const INSTALLED_KEY = "samanta_app_installed";

export default function InstallAppPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isStandalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    // Already running as an installed app.
    if (isStandalone()) return;

    let timer;

    const handleInstallAvailable = (event) => {
      event.preventDefault();

      // If a previous installation was recorded, the app
      // may have been uninstalled. Installability is available
      // again, so allow the prompt to appear again.
      if (localStorage.getItem(INSTALLED_KEY) === "true") {
        localStorage.removeItem(INSTALLED_KEY);
        localStorage.removeItem(DISMISSED_KEY);
      }

      setInstallPrompt(event);

      if (
        localStorage.getItem(DISMISSED_KEY) !== "true" &&
        !isStandalone()
      ) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "true");
      localStorage.removeItem(DISMISSED_KEY);
      setShowPrompt(false);
      setInstallPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleInstallAvailable
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show the prompt unless the user previously chose
    // Continue in Browser or the app is already installed.
    if (
      localStorage.getItem(DISMISSED_KEY) !== "true" &&
      localStorage.getItem(INSTALLED_KEY) !== "true"
    ) {
      timer = setTimeout(() => {
        if (!isStandalone()) setShowPrompt(true);
      }, 800);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleInstallAvailable
      );
      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      alert(
        "Installation is not available right now. " +
        "On Android Chrome, open the browser menu and select " +
        "'Install app' or 'Add to Home screen'."
      );
      return;
    }

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;

      if (result.outcome === "accepted") {
        localStorage.setItem(INSTALLED_KEY, "true");
        localStorage.removeItem(DISMISSED_KEY);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Installation failed:", error);
    } finally {
      setInstallPrompt(null);
    }
  };

  const handleContinue = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="install-overlay">
      <div
        className="install-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
      >
        <button
          className="install-close"
          onClick={handleContinue}
          aria-label="Close install prompt"
        >
          <X size={20} />
        </button>

        <div className="install-icon">
          <BookOpen size={36} strokeWidth={1.7} />
        </div>

        <h2 id="install-title">Samanta E-Book Stall</h2>

        <p>
          Install our app for quick access to your
          favourite books and a better browsing experience.
        </p>

        <button className="install-yes" onClick={handleInstall}>
          <Download size={18} />
          Install App
        </button>

        <button className="install-no" onClick={handleContinue}>
          <Globe size={18} />
          Continue in Browser
        </button>
      </div>
    </div>
  );
}
