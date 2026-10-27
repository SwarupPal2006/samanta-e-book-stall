import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Pencil,
  Star,
  LibraryBig,
  Coffee,
  Atom,
} from "lucide-react";
import "../Styles/loadingScreen.css";

const floatingIcons = [
  { Icon: BookOpen, className: "float-book" },
  { Icon: GraduationCap, className: "float-cap" },
  { Icon: Sparkles, className: "float-sparkle" },
  { Icon: Pencil, className: "float-pencil" },
  { Icon: Atom, className: "float-atom" },
];

export default function LoadingScreen({
  progress = null,
  message = "We're getting things ready for you...",
}) {
  const hasProgress =
    typeof progress === "number" && Number.isFinite(progress);

  const safeProgress = hasProgress
    ? Math.min(100, Math.max(0, progress))
    : null;

  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDots((current) => (current + 1) % 4);
    }, 450);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main
      className="loading-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading application"
    >
      <div className="loading-ambient ambient-one" />
      <div className="loading-ambient ambient-two" />
      <div className="loading-wave loading-wave-top" />
      <div className="loading-wave loading-wave-bottom" />

      <div className="loading-layout">
        <section className="loading-visual" aria-hidden="true">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="illustration-glow" />

          {floatingIcons.map(({ Icon, className }) => (
            <div
              className={`floating-icon ${className}`}
              key={className}
            >
              <Icon size={22} strokeWidth={1.8} />
            </div>
          ))}

          <div className="loading-illustration">
            <div className="illustration-sparkle sparkle-one">
              <Sparkles size={20} />
            </div>
            <div className="illustration-sparkle sparkle-two">
              <Star size={16} />
            </div>

            <div className="book-stack">
              <div className="book book-bottom">
                <span className="book-spine" />
                <span className="book-pages" />
                <span className="book-bookmark" />
              </div>

              <div className="book book-middle">
                <span className="book-spine" />
                <span className="book-pages" />
              </div>

              <div className="book book-top">
                <span className="book-spine" />
                <span className="book-pages" />
                <BookOpen className="book-cover-icon" size={30} />
              </div>

              <div className="loading-cup">
                <div className="cup-handle" />
                <div className="cup-body">
                  <Coffee size={29} strokeWidth={1.7} />
                </div>
                <div className="cup-rim" />
                <span className="steam steam-one" />
                <span className="steam steam-two" />
                <span className="steam steam-three" />
              </div>
            </div>

            <div className="illustration-ground" />
          </div>

          <div className="visual-caption">
            <span className="caption-line" />
            <span>Preparing your experience</span>
            <span className="caption-line" />
          </div>
        </section>

        <section className="loading-copy">
          <div className="loading-brand">
            <div className="brand-icon">
              <LibraryBig size={20} />
            </div>
            <span>YOUR LIBRARY</span>
          </div>

          <div className="loading-heading-wrap">
            <span className="loading-eyebrow">
              <Sparkles size={15} />
              A LITTLE MOMENT, A LOT TO EXPLORE
            </span>

            <h1>
              Hang tight<span className="heading-period">.</span>
            </h1>

            <p className="loading-message">{message}</p>
          </div>

          <div className="loading-status">
            <div className="status-label">
              <span>
                <span className="status-indicator" />
                {hasProgress ? "Loading your library" : "Getting everything ready"}
              </span>

              {hasProgress && (
                <strong>{Math.round(safeProgress)}%</strong>
              )}
            </div>

            <div
              className={`loading-progress ${
                hasProgress ? "is-determinate" : "is-indeterminate"
              }`}
              role="progressbar"
              aria-label="Loading progress"
              aria-valuemin={hasProgress ? 0 : undefined}
              aria-valuemax={hasProgress ? 100 : undefined}
              aria-valuenow={hasProgress ? safeProgress : undefined}
            >
              <div
                className="loading-progress-fill"
                style={
                  hasProgress
                    ? { width: `${safeProgress}%` }
                    : undefined
                }
              />
            </div>

            <div className="loading-progress-meta">
              <span>
                {hasProgress
                  ? safeProgress === 100
                    ? "All set!"
                    : "Almost there"
                  : "Good things take a moment"}
              </span>
              <span className="loading-dots" aria-hidden="true">
                {".".repeat(dots)}
              </span>
            </div>
          </div>

          <div className="loading-features">
            <div className="feature-item">
              <span className="feature-icon">
                <BookOpen size={18} />
              </span>
              <span>Great reads</span>
            </div>

            <span className="feature-divider" />

            <div className="feature-item">
              <span className="feature-icon">
                <GraduationCap size={19} />
              </span>
              <span>New ideas</span>
            </div>

            <span className="feature-divider" />

            <div className="feature-item">
              <span className="feature-icon">
                <Sparkles size={18} />
              </span>
              <span>More to explore</span>
            </div>
          </div>

          <div className="loading-footer">
            <span className="footer-dot" />
            Thoughtfully curated, just for you
          </div>
        </section>
      </div>
    </main>
  );
}
