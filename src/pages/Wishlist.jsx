import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,BookmarkCheck,
  ArrowRight,
  Heart,
  BookOpen,
} from "lucide-react";

import { AppContext } from "../context/AppContext";
import BookCard from "../components/BookCard";
import Previous from "../services/previousButton";

import "../Styles/Wishlist.css";

export default function Wishlist() {
  const context = useContext(AppContext);

  const wishlist = context?.wishlist ?? [];
  const onAddToWishlist = context?.onAddToWishlist;

  return (
    <main className="wishlist-page">
      {/* MOBILE PREVIOUS BUTTON */}
      <div className="wishlist-previous">
        <Previous />
      </div>

      {/* PAGE HEADER */}
      <header className="wishlist-header">
        <div className="wishlist-heading-icon">
          <Bookmark size={25} strokeWidth={1.8} />
        </div>

        <div className="wishlist-heading-content">
          <span className="wishlist-eyebrow">
            YOUR PERSONAL COLLECTION
          </span>

          <h1>My Wishlist</h1>

          <p>
            Keep the books and products you love close at hand.
          </p>
        </div>

        <span className="wishlist-count">
          <BookmarkCheck size={15} />
          {wishlist.length}{" "}
          {wishlist.length === 1 ? "item" : "items"}
        </span>
      </header>

      {wishlist.length === 0 ? (
        /* EMPTY STATE */
        <section className="wishlist-empty">
          <div className="wishlist-empty-art">
            <div className="wishlist-empty-icon">
              <Heart size={42} strokeWidth={1.4} />
            </div>

            <span className="wishlist-art-dot wishlist-dot-one" />
            <span className="wishlist-art-dot wishlist-dot-two" />
          </div>

          <span className="wishlist-empty-label">
            NOTHING SAVED YET
          </span>

          <h2>Your wishlist is waiting</h2>

          <p>
            Found something you love? Tap the heart icon on any
            book or product card to save it here for later.
          </p>

          <div className="wishlist-empty-actions">
            <Link to="/books" className="wishlist-shop-button">
              <BookOpen size={18} />
              Explore Books
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/products"
              className="wishlist-secondary-button"
            >
              Browse Products
            </Link>
          </div>
        </section>
      ) : (
        /* SAVED ITEMS */
        <section className="wishlist-results">
          <div className="wishlist-results-heading">
            <div>
              <h2>Saved Items</h2>
              <p>Your favourites, ready whenever you are.</p>
            </div>

            <Link
              to="/products"
              className="wishlist-browse-link"
            >
              Browse Products
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="wishlist-grid">
            {wishlist.map((book) => {
              const id = book.id ?? book._id;

              return (
                <BookCard
                  key={id}
                  book={{ ...book, id }}
                  onAddToWishlist={onAddToWishlist}
                  isWishlisted={true}
                />
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
