
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { auth } from "../services/firebase";
import "../Styles/adminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const allowedUid = import.meta.env.VITE_ADMIN_UID;

      if (!allowedUid || credential.user.uid !== allowedUid) {
        await signOut(auth);
        throw new Error("This account is not authorized as admin.");
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      const messages = {
        "auth/invalid-credential":
          "Incorrect email or password. Please try again.",
        "auth/user-not-found":
          "No account was found with this email address.",
        "auth/wrong-password":
          "Incorrect email or password. Please try again.",
        "auth/invalid-email":
          "Please enter a valid email address.",
        "auth/too-many-requests":
          "Too many attempts. Please wait a while and try again.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
        "auth/invalid-login-credentials":
          "Incorrect email or password. Please try again.",
      };

      setError(
        messages[err.code] ||
          err.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell">
    <main className="admin-login-page">
      {/* Animated background */}
      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />
      <div className="login-orb login-orb-three" />

      <div className="login-layout">
        {/* Left welcome section */}
        <section className="login-welcome">
          <div className="login-brand">
            <div className="login-brand-icon">
              <BookOpen size={25} strokeWidth={2.2} />
            </div>

            <div>
              <span className="login-brand-name">Bookstore</span>
              <span className="login-brand-caption">
                ADMINISTRATION
              </span>
            </div>
          </div>

          <div className="login-welcome-content">
            <span className="login-overline">
              <span className="login-live-dot" />
              YOUR CONTROL CENTER
            </span>

            <h1>
              Welcome
              <br />
              <span>back, Admin.</span>
            </h1>

            <p className="login-welcome-description">
              Your books, products and store operations,
              all in one place. Sign in to continue managing
              your bookstore.
            </p>

            <div className="login-feature">
              <div className="login-feature-icon">
                <ShieldCheck size={22} />
              </div>

              <div>
                <strong>Secure admin access</strong>
                <p>Protected authentication powered by Firebase.</p>
              </div>
            </div>
          </div>

          <div className="login-welcome-footer">
            <span className="login-footer-line" />
            <span>Everything you need to run your store.</span>
          </div>
        </section>

        {/* Login form */}
        <section className="login-form-section">
          <div className="admin-login-card">
            <div className="login-mobile-brand">
              <div className="login-brand-icon">
                <BookOpen size={23} />
              </div>
              <span>Bookstore Admin</span>
            </div>

            <div className="login-card-heading">
              <div className="login-heading-icon">
                <LockKeyhole size={23} />
              </div>

              <h2>Admin sign in</h2>
              <p>
                Enter your credentials to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="admin-email">
                  Email address
                </label>

                <div className="login-input-wrap">
                  {/* <Mail
                    className="login-input-icon"
                    size={19}
                    aria-hidden="true"
                  /> */}

                  <input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="admin-password">
                  Password
                </label>

                <div className="login-input-wrap">
                  {/* <LockKeyhole
                    className="login-input-icon"
                    size={19}
                    aria-hidden="true"
                  /> */}

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    required
                  />

                </div>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  <span className="login-error-mark">!</span>
                  <p>{error}</p>
                </div>
              )}

              <button
                className={`login-submit ${loading ? "is-loading" : ""}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="login-spinner"
                      aria-hidden="true"
                    />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to dashboard</span>
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="login-secure-note">
              <ShieldCheck size={16} />
              <span>Your session is protected and secure.</span>
            </div>

            <div className="login-card-bottom">
              <span />
              <span>BOOKSTORE MANAGEMENT</span>
              <span />
            </div>
          </div>
        </section>
      </div>

      <footer className="login-page-footer">
        <span>© {new Date().getFullYear()} Bookstore</span>
        <span className="login-footer-separator">•</span>
        <span>Admin Portal</span>
      </footer>
    </main>
    </div>

  );
}
