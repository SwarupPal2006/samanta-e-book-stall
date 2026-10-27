
import { useEffect, useState } from "react";
import { getCatalogue } from "../services/catalogueService";
import BookCard from "../components/BookCard";
import Previous from "../services/previousButton";
import "../Styles/discover.css";

export default function Discover() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCatalogue() {
      try {
        setLoading(true);
        setError("");

        const items = await getCatalogue("all");

        if (active) setBooks(items);
      } catch (err) {
        console.error("Failed to load Discover catalogue:", err);

        if (active) {
          setError("Unable to load the catalogue. Please try again later.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCatalogue();

    return () => {
      active = false;
    };
  }, []);

  const filteredBooks = books.filter((book) => {
    const title = String(book.title || "");
    const author = String(book.author || "");
    const description = String(book.description || "");
    const query = search.trim().toLowerCase();

    const matchesSearch =
      title.toLowerCase().includes(query) ||
      author.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      String(book.category || "").toLowerCase().includes(query);

    const matchesCategory = category
      ? String(book.category || "").toLowerCase() === category.toLowerCase()
      : true;

    const matchesLetter = letter
      ? title.toUpperCase().startsWith(letter)
      : true;

    return matchesSearch && matchesCategory && matchesLetter;
  });

  return (
    <section className="discover">
      {/* Header */}
      <header className="search-header">
        <div className="discover-previous">
          <Previous />
        </div>

        <div className="discover-heading">
          {/* <span className="discover-eyebrow">YOUR NEXT GREAT READ</span> */}
          <h1>Discover</h1>
          <p>Explore books and products from our catalogue.</p>
        </div>
      </header>

      {/* Search */}
      <div className="discover-search">
        <input
          type="search"
          placeholder="Search titles, authors or categories..."
          aria-label="Search books and products"
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Alphabet Filter */}
      <section className="discover-filter-section">
        <div className="discover-filter-heading">
          <h2>Browse alphabetically</h2>

          <button
            type="button"
            className="discover-reset"
            onClick={() => {
              setLetter("");
              setCategory("");
              setSearch("");
            }}
          >
            Reset filters
          </button>
        </div>

        <div className="letters" aria-label="Filter by first letter">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
            <button
              type="button"
              key={char}
              className={letter === char ? "selected" : ""}
              onClick={() =>
                setLetter((current) => (current === char ? "" : char))
              }
              aria-pressed={letter === char}
              aria-label={`Filter titles starting with ${char}`}
            >
              {char}
            </button>
          ))}

          <button
            type="button"
            className={`all-letters ${!letter ? "selected" : ""}`}
            onClick={() => setLetter("")}
            aria-pressed={!letter}
          >
            All
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="discover-results">
        {!loading && !error && (
          <div className="discover-results-header">
            <h2>Explore catalogue</h2>
            <span className="discover-count">
              {filteredBooks.length} items
            </span>
          </div>
        )}

        {loading && (
          <p className="discover-message">Loading catalogue...</p>
        )}

        {!loading && error && (
          <p className="discover-error" role="alert">{error}</p>
        )}

        {!loading && !error && filteredBooks.length > 0 && (
          <div className="products discover-grid">
            {filteredBooks.slice(0, 12).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {!loading && !error && filteredBooks.length === 0 && (
          <div className="discover-empty">
            <h3>No matching items found</h3>
            <p>Try another title, author, category or letter.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setLetter("");
                setCategory("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </section>
  );
}
