
import { useEffect, useState } from "react";
import {
  BookOpen,
  Sparkles,
  LoaderCircle,
  LibraryBig,
} from "lucide-react";
import "../Styles/loadingScreen.css";

export default function MobileLoading() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");

    const updateVisibility = () => {
      setVisible(!desktop.matches);
    };

    updateVisibility();
    desktop.addEventListener("change", updateVisibility);

    // Simulated loading duration
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2600);

    return () => {
      clearTimeout(timer);
      desktop.removeEventListener("change", updateVisibility);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="mobile-loading-screen">
      <div className="ml-glow ml-glow-one" />
      <div className="ml-glow ml-glow-two" />

      <div className="ml-content">
        <div className="ml-logo-wrap">
          <div className="ml-logo-ring" />
          <div className="ml-logo">
            <BookOpen size={34} strokeWidth={1.8} />
          </div>
          <Sparkles className="ml-sparkle" size={20} />
        </div>

        <h1 className="ml-title">
          Samanta <span>Books</span>
        </h1>

        <p className="ml-subtitle">
          Your next favourite book awaits.
        </p>

        <div className="ml-book-animation">
          <div className="ml-book-card ml-book-left">
            <LibraryBig size={25} />
          </div>
          <div className="ml-book-card ml-book-center">
            <BookOpen size={30} />
          </div>
          <div className="ml-book-card ml-book-right">
            <Sparkles size={24} />
          </div>
        </div>

        <div className="ml-progress-track">
          <div className="ml-progress-fill" />
        </div>

        <div className="ml-status">
          <LoaderCircle size={15} className="ml-spinner" />
          <span>Preparing your reading space...</span>
        </div>

        <div className="ml-footer">
          <span className="ml-footer-dot" />
          A little world of books
        </div>
      </div>
    </div>
  );
}
