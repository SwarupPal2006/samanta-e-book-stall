
import React, { useEffect } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  UserRound,
  Database,
  Share2,
  Cookie,
  RefreshCw,
  Phone,
  ChevronRight,
  BookOpen,
} from "lucide-react";

import "../Styles/Privacy.css";

const policies = [
  {
    number: "01",
    icon: UserRound,
    title: "Information We Collect",
    description:
      "We may collect basic information such as your name, email address, mobile number, and delivery address when you interact with our services.",
    tag: "Your information",
  },
  {
    number: "02",
    icon: Database,
    title: "How We Use Your Information",
    description:
      "Your information helps us improve your shopping experience, manage account-related activities, process requests, and provide relevant book recommendations.",
    tag: "Better experience",
  },
  {
    number: "03",
    icon: LockKeyhole,
    title: "Data Protection",
    description:
      "We take reasonable security measures to protect your personal information against unauthorized access, misuse, alteration, or disclosure.",
    tag: "Security first",
  },
  {
    number: "04",
    icon: Share2,
    title: "Third-Party Services",
    description:
      "We do not sell your personal information. Information may be shared with necessary service providers to operate our services or when legally required.",
    tag: "Your privacy matters",
  },
  {
    number: "05",
    icon: Cookie,
    title: "Cookies & Website Usage",
    description:
      "Our website may use cookies or similar technologies to improve functionality, understand website usage, and provide a smoother browsing experience.",
    tag: "Website experience",
  },
  {
    number: "06",
    icon: RefreshCw,
    title: "Changes to This Policy",
    description:
      "We may update this Privacy Policy as our services evolve. Any revised version will be published on this page with the updated information.",
    tag: "Stay informed",
  },
];

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Samanta E-Book Stall";
  }, []);

  return (
    <main className="privacy-page">
      {/* Hero */}
      <section className="privacy-hero">
        <div className="privacy-hero-glow privacy-glow-one" />
        <div className="privacy-hero-glow privacy-glow-two" />

        <div className="privacy-hero-inner">
          <div className="privacy-breadcrumb">
            <BookOpen size={15} />
            <span>Samanta E-Book Stall</span>
            <ChevronRight size={14} />
            <span>Privacy Policy</span>
          </div>

          <div className="privacy-hero-content">
            <div className="privacy-hero-icon">
              <ShieldCheck size={38} strokeWidth={1.6} />
            </div>

            <span className="privacy-eyebrow">
              YOUR PRIVACY, OUR PRIORITY
            </span>

            <h1>
              Privacy Policy<span>.</span>
            </h1>

            <p>
              Your trust matters to us. Learn how we collect, use,
              and protect your information when you visit our bookstore.
            </p>

            <div className="privacy-updated">
              <span className="privacy-status-dot" />
              <span>Simple. Transparent. Secure.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="privacy-content">
        <div className="privacy-intro">
          <div className="privacy-intro-mark">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h2>Your privacy deserves clarity.</h2>
            <p>
              Welcome to Samanta E-Book Stall. This policy explains
              how your information may be collected, used, and
              protected when you use our website and services.
            </p>
          </div>
        </div>

        <div className="privacy-section-heading">
          <div>
            <span className="privacy-eyebrow">THE DETAILS</span>
            <h2>Our privacy principles</h2>
          </div>
          <span className="privacy-section-count">06 POLICIES</span>
        </div>

        <div className="privacy-grid">
          {policies.map((policy) => {
            const Icon = policy.icon;

            return (
              <article
                className="privacy-card"
                key={policy.number}
              >
                <div className="privacy-card-top">
                  <div className="privacy-card-icon">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>
                  <span className="privacy-card-number">
                    {policy.number}
                  </span>
                </div>

                <h3>{policy.title}</h3>
                <p>{policy.description}</p>

                <div className="privacy-card-tag">
                  <span />
                  {policy.tag}
                </div>
              </article>
            );
          })}
        </div>

        {/* Contact section */}
        <section className="privacy-contact">
          <div className="privacy-contact-icon">
            <Phone size={25} />
          </div>

          <div className="privacy-contact-copy">
            <span className="privacy-eyebrow">WE'RE HERE TO HELP</span>
            <h2>Have a privacy question?</h2>
            <p>
              If you have questions about this policy or how your
              information is handled, feel free to contact us.
            </p>
          </div>

          <a
            className="privacy-contact-button"
            href="tel:9564656607"
          >
            <Phone size={17} />
            9564656607
          </a>
        </section>

        <div className="privacy-footer-note">
          <ShieldCheck size={17} />
          <p>
            Thank you for choosing Samanta E-Book Stall.
            We value your trust and are committed to treating
            your information responsibly.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Privacy;
