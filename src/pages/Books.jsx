
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalogue } from "../services/catalogueService";
import Previous from "../services/previousButton";
import "../Styles/userMenu.css";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getCatalogue("book")
      .then(setBooks)
      .catch(() =>
        setError("Unable to load books. Please try again later.")
      );
  }, []);

  const filtered = books.filter((book) =>
    `${book.title || ""} ${book.author || ""} ${book.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="catalogue-page books-page">
      <header className="books-page-header">
        <div className="books-heading">
          <div className="books-previous">
            <Previous />
          </div>

          <h1>Explore Books</h1>
          {/* <p>Discover books in the Samanta catalogue.</p> */}
        </div>
      </header>

      <div className="books-search">
        <input
          type="search"
          aria-label="Search books"
          placeholder="Search books, authors or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p className="books-error" role="alert">{error}</p>}

      {!error && filtered.length === 0 && (
        <p className="books-empty">No books found.</p>
      )}

      <div className="catalogue-grid books-grid">
        {filtered.map((book) => (
          <Link
            to={`/product/${book.id}`}
            className="catalogue-card books-card"
            key={book.id}
          >
            <div className="books-card-image">
              {book.imageUrl || book.image ? (
                <img
                  src={book.imageUrl || book.image}
                  alt={book.title}
                  loading="lazy"
                />
              ) : (
                <div className="books-image-placeholder">
                  No image available
                </div>
              )}
            </div>

            <div className="books-card-info">
              <span className="books-card-category">
                {book.category || "Uncategorized"}
              </span>

              <h2>{book.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
