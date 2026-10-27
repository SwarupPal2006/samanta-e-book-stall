
import {
  ChevronRight,
  Zap,
  MapPin,
} from "lucide-react";
import "../Styles/Home.css";
import BookCard from "../components/BookCard";
import { getCatalogue } from "../services/catalogueService";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import FAQ from "../components/FAQ";
import { Link } from "react-router-dom";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [offlineOffer] = useState({
    isActive: true,
    title: "Weekend Store Fiesta!",
    discount: "Get 20% OFF",
    description:
      "Visit our downtown Namkhana store this weekend and get exclusive discounts on all premium stationery.",
    location: "Narayanpur, West Bengal",
    validUntil: "This Sunday",
  });
  const context = useContext(AppContext);

const wishlist = context?.wishlist ?? [];
const onAddToWishlist = context?.onAddToWishlist;

const isWishlisted = (book) =>
  wishlist.some(
    (item) =>
      String(item.id ?? item._id) ===
      String(book.id ?? book._id)
  );

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError("");

        const [items, productItems] = await Promise.all([
  getCatalogue("book"),
  getCatalogue("product"),
]);

if (active) {
  setBooks(items);
  setProducts(productItems);
}
      } catch (err) {
        console.error("Failed to load books:", err);
        if (active) {
          setError("Unable to load books. Please try again later.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <section className="home-hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-tag">
            Discover Worlds & Craft Ideas
          </span>

          <h1 className="heading">
            Your Premium Destination for{" "}
            <span className="highlight">Books & Stationery</span>
          </h1>
{/* 
          <p>
            Explore thousands of curated titles and elevate your workspace.
          </p> */}

          <a href="/recommendation" className="hero-btn">
            Shop Collection <ChevronRight size={20} />
          </a>
        </div>
      </section>

      {offlineOffer.isActive && (
        <section className="custom-deal-section">
          <div className="custom-deal-bg-icon">
            <Zap size={200} />
          </div>

          <div className="custom-deal-content">
            <div className="custom-deal-icon-box">
              <MapPin color="#7c2d12" size={32} />
            </div>

            <div>
              <div className="custom-deal-header">
                <span className="custom-deal-badge">Offline Only</span>
                <h3 className="custom-deal-title">
                  {offlineOffer.title}
                </h3>
              </div>

              <p className="custom-deal-desc">
                {offlineOffer.discount} - {offlineOffer.description}
              </p>

              <p className="custom-deal-meta">
                <MapPin size={14} /> {offlineOffer.location} &bull; Valid
                until {offlineOffer.validUntil}
              </p>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/2tprMa15TFnax4Fk9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button" className="custom-deal-button">
              Get Directions
            </button>
          </a>
        </section>
      )}

      
<section className="section">
  <div className="home-section-heading">
    <div>
      <span className="home-section-eyebrow">
        CUSTOMER FAVOURITES
      </span>
      <h2>Bestselling Books</h2>
      <p>Popular picks, chosen for you.</p>
    </div>

    <a href="/recommendation" className="home-see-all">
      See All <ChevronRight size={18} />
    </a>
  </div>

  {loading && <p>Loading books...</p>}

  {!loading && error && (
    <p role="alert">{error}</p>
  )}

  {!loading && !error && (
    <div className="products">
      {books
        .filter((book) => book.bestseller === true)
        .slice(0, 8)
        .map((book) => (
          <BookCard
  key={book.id ?? book._id}
  book={book}
  onAddToWishlist={onAddToWishlist}
  isWishlisted={isWishlisted(book)}
/>
        ))}
    </div>
  )}

  {!loading &&
    !error &&
    books.filter((book) => book.bestseller === true).length === 0 && (
      <p>No bestselling books selected yet.</p>
    )}
</section>


{/* AVAILABLE BOOKS SECTION */}
<section className="section">
  <div className="home-section-heading">
    <div>
      <span className="home-section-eyebrow">
        EXPLORE THE COLLECTION
      </span>
      <h2>Available Books</h2>
      <p>Discover your next favourite read.</p>
    </div>

    <Link to="/books" className="home-see-all">
  See All <ChevronRight size={18} />
</Link>
  </div>

  {loading && <p>Loading books...</p>}

  {!loading && error && (
    <p role="alert">{error}</p>
  )}

  {!loading && !error && (
    <div className="products">
      {books
        .filter((book) => book.bestseller !== true)
        .slice(0, 8)
        .map((book) => (
          <BookCard
  key={book.id ?? book._id}
  book={book}
  onAddToWishlist={onAddToWishlist}
  isWishlisted={isWishlisted(book)}
/>
        ))}
    </div>
  )}

  {!loading &&
    !error &&
    books.filter((book) => book.bestseller !== true).length === 0 && (
      <p>No other published books are available yet.</p>
    )}
</section>


{/* PRODUCTS SECTION */}
<section className="section">
  <div className="home-section-heading">
    <div>
      <span className="home-section-eyebrow">
        MORE FOR YOUR EVERYDAY
      </span>
      <h2>Stationery & Products</h2>
      <p>Explore useful essentials for study and creativity.</p>
    </div>

    <Link to="/products" className="home-see-all">
      See All <ChevronRight size={18} />
    </Link>
  </div>

  {loading && <p>Loading products...</p>}

  {!loading && !error && products.length === 0 && (
    <p>No published products are available yet.</p>
  )}

  {!loading && !error && products.length > 0 && (
    <div className="products">
      {products.slice(0, 8).map((product) => (
        <BookCard
  key={product.id ?? product._id}
  book={product}
  onAddToWishlist={onAddToWishlist}
  isWishlisted={isWishlisted(product)}
/>
      ))}
    </div>
  )}

  {!loading && error && (
    <p role="alert">{error}</p>
  )}
</section>


<FAQ/>
    </div>
  );
}
