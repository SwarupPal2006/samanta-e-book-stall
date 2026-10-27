
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import "../Styles/FAQ.css";

const faqs = [
  {
    question: "What types of books are available?",
    answer:
      "Explore our collection of books across different categories. Browse the available books on our website to find your next read.",
  },
  {
    question: "What stationery and other products do you offer?",
    answer:
      "Discover our selection of stationery and other useful products in the Products section of our website.",
  },
  {
    question: "How can I check product availability?",
    answer:
      "Check each item card for its current status. Products marked In Stock are available, while Out of Stock items are currently unavailable.",
  },
  {
    question: "How can I find best-selling books?",
    answer:
      "Visit the Best Selling Books section on our homepage to explore our featured popular reads.",
  },
  {
    question: "Can I save my favourite books and products?",
    answer:
      "Yes! Use the wishlist feature to save your favourite items and find them easily later.",
  },
  {
    question: "Where is your store located?",
    answer:
      "Our store serves customers in Narayanpur, West Bengal. Please contact us for further location details.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-heading">
          <span className="faq-eyebrow">
            <HelpCircle size={16} />
            NEED HELP?
          </span>

          <h2>
            Frequently Asked <span>Questions</span>
          </h2>

          <p>
            Quick answers to help you find exactly what you need.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                className={`faq-item ${isOpen ? "faq-open" : ""}`}
                key={faq.question}
                style={{ "--faq-index": index }}
              >
                <button
                  className="faq-question"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="faq-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="faq-question-text">
                    {faq.question}
                  </span>

                  <span className="faq-chevron">
                    <ChevronDown size={19} />
                  </span>
                </button>

                <div
                  className="faq-answer-wrapper"
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq-bottom">
          <span>Still have questions?</span>
          <p>
            Get in touch with us for more information.
          </p>
        </div>
      </div>
    </section>
  );
}
