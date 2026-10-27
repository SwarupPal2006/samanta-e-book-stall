
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, BookOpen, Search, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import "../Styles/category.css";
import categories from "../data/categories";
import { getCatalogue } from "../services/catalogueService";

export default function CategoryHero() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCatalogue() {
      try {
        setLoading(true);
        setError("");

        const result = await getCatalogue();

        if (active) {
          setProducts(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error("Failed to load catalogue:", err);
        if (active) setError("Unable to load the catalogue. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCatalogue();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category = String(product.category || "").trim();
      const title = String(product.title || product.name || "");
      const query = search.trim().toLowerCase();

      const matchesCategory =
        selectedCategory === "All Items" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        String(product.author || "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const descriptions = [
    "Explore books, stationery, and everyday essentials.",
    "Find your next favourite story and discover new worlds.",
    "Discover study resources and books for your learning journey.",
    "Inspiration for your next big idea starts here.",
    "Browse your catalogue and find something worth keeping."
  ];

  const [descriptionIndex, setDescriptionIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDescriptionIndex((previous) => (previous + 1) % descriptions.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const imageOf = (product) =>
    product.imageUrl || product.imageURL || product.image ||
    product.photoURL || product.thumbnail || "";

  const titleOf = (product) => product.title || product.name || "Untitled item";

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") return null;
    const amount = Number(price);
    return Number.isFinite(amount)
      ? `₹${amount.toLocaleString("en-IN")}`
      : String(price);
  };

  return (
    <main className="catalog-page">
      {/* HERO */}
     
<section className="category-hero">
  <div className="hero-content">
    <span className="hero-eyebrow">
      <span className="eyebrow-dot" />
      YOUR CATALOGUE
    </span>

    <h1>
      Find something
      <span>you'll love.</span>
    </h1>

    <p className="hero-desc" key={descriptionIndex}>
      {descriptions[descriptionIndex]}
    </p>

    <button
      type="button"
      className="hero-cta"
      onClick={() =>
        document.getElementById("catalog")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    >
      Explore collection
      <ChevronRight size={17} />
    </button>
  </div>

  <div className="hero-art" aria-hidden="true">
    <div className="hero-art-ring" />

    <div className="hero-book-card">
      <div className="hero-book-icon">
        <BookOpen size={68} strokeWidth={1.35} />
      </div>
      <span>Discover your next favourite</span>
    </div>

    <div className="hero-floating-dot" />
    <div className="hero-floating-square" />
    <div className="hero-orbit-dot" />
  </div>
</section>


      {/* CATEGORIES */}
      <section className="catalog-section" id="catalog">
        <div className="catalog-heading">
          <div>
            <span className="section-kicker">BROWSE YOUR WAY</span>
            <h2>Explore categories</h2>
            <p>One catalogue. Everything you need.</p>
          </div>
        </div>

        <div className="category-pills" aria-label="Filter by category">
          <button
            type="button"
            className={`category-pill ${
              selectedCategory === "All Items" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("All Items")}
          >
            <PackageOpen size={17} />
            All Items
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={`category-pill ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* PRODUCT HEADER */}
        <div className="products-toolbar">
          <div>
            <h2>
              {selectedCategory === "All Items"
                ? "All products"
                : selectedCategory}
            </h2>
            <p>
              {loading
                ? "Loading items..."
                : `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "item" : "items"
                  } found`}
            </p>
          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="catalog-state">
            <span className="catalog-spinner" />
            <p>Discovering your catalogue...</p>
          </div>
        ) : error ? (
          <div className="catalog-state">
            <p>{error}</p>
            <button
              type="button"
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="catalog-state empty-state">
            <PackageOpen size={38} />
            <h3>No items found</h3>
            <p>Try another category or change your search.</p>
            <button
              type="button"
              className="retry-button"
              onClick={() => {
                setSelectedCategory("All Items");
                setSearch("");
              }}
            >
              Show all items
            </button>
          </div>
        ) : (
          <div className="product-image-grid">
            {filteredProducts.map((product, index) => {
              const image = imageOf(product);

              return (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id || `${titleOf(product)}-${index}`}
                  className="catalog-product"
                  style={{ "--item-index": Math.min(index, 15) }}
                  title={titleOf(product)}
                >
                  <div className="catalog-product-image">
                    {image ? (
                      <img
                        src={image}
                        alt={titleOf(product)}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.nextElementSibling?.classList
                            .remove("fallback-hidden");
                        }}
                      />
                    ) : null}

                    <div
                      className={`product-image-fallback ${
                        image ? "fallback-hidden" : ""
                      }`}
                    >
                      <BookOpen size={30} strokeWidth={1.3} />
                    </div>
                  </div>

                  {/* <div className="catalog-product-info">
                    <span className="product-category-label">
                      {product.category || "Catalogue"}
                    </span>
                    <h3>{titleOf(product)}</h3>
                    {formatPrice(product.price) && (
                      <p className="catalog-product-price">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </div> */}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
