import { useEffect, useState } from "react";
import { getCatalogue } from "../services/catalogueService";
import { Link } from "react-router-dom";
import Previous from "../services/previousButton";
import "../Styles/userMenu.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getCatalogue("product")
      .then(setProducts)
      .catch(() =>
        setError("Unable to load products. Please try again later.")
      );
  }, []);

  const filtered = products.filter((product) =>
    `${product.title} ${product.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="catalogue-page products-page">
      <header className="products-page-header">
        <div className="products-heading">
          <div className="products-previous">
          <Previous />
          </div>
          {/* <span className="products-eyebrow">
            YOUR EVERYDAY ESSENTIALS
          </span> */}
          <h1>Explore Products</h1>
        </div>
      </header>

      <div className="products-search">
        <input
          aria-label="Search products"
          placeholder="Search products or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p role="alert">{error}</p>}

      {!error && filtered.length === 0 && (
        <p className="products-empty">No products found.</p>
      )}

      <div className="catalogue-grid products-grid">
        {filtered.map((product) => (
          <Link
            to={`/product/${product.id}`}
            className="catalogue-card products-card"
            key={product.id}
          >
            <div className="products-card-image">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  loading="lazy"
                />
              ) : (
                <div className="products-image-placeholder">
                  No image available
                </div>
              )}
            </div>

            <div className="products-card-info">
              <span className="products-card-category">
                {product.category || "Uncategorized"}
              </span>
              <h2>{product.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}