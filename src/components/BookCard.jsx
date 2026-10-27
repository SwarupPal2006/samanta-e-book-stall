
import { Link } from "react-router-dom";
import {
  Bookmark,
  PackageCheck,
  PackageX,
  CircleHelp,
} from "lucide-react";

import "../Styles/card.css";

const BookCard = ({
  book,
  onAddToWishlist,
  isWishlisted = false,
}) => {
  const imageUrl = book.imageUrl || book.image || "";
  const stockStatus = book.stockStatus;

  const handleWishlistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onAddToWishlist?.(book);
  };

  const stockInfo =
    stockStatus === "in-stock"
      ? {
          label: "In Stock",
          className: "in-stock",
          Icon: PackageCheck,
        }
      : stockStatus === "out-of-stock"
        ? {
            label: "Out of Stock",
            className: "out-of-stock",
            Icon: PackageX,
          }
        : {
            label: "Stock Unavailable",
            className: "stock-unknown",
            Icon: CircleHelp,
          };

  const StockIcon = stockInfo.Icon;

  return (
    <div className="card-wrapper">
      <Link to={`/product/${book.id}`} className="card-link">
        <div className="card">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={book.title}
              loading="lazy"
            />
          ) : (
            <div className="book-image-placeholder">
              No image available
            </div>
          )}

          <div className="card-info">
            <p className="card-category">
              {book.category || "Uncategorized"}
            </p>
            <h4>{book.title}</h4>

            

            <span
              className={`card-stock ${stockInfo.className}`}
            >
              <StockIcon size={14} strokeWidth={2} />
              {stockInfo.label}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="wishlist-icon"
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        aria-pressed={isWishlisted}
        onClick={handleWishlistClick}
      >
        <Bookmark
          size={19}
          strokeWidth={1.8}
          fill={isWishlisted ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
};

export default BookCard;
