import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getCatalogue,
  getCatalogueItem,
} from "../services/catalogueService";
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  Copy,
  ArrowRight,
  Package,
} from "lucide-react";
import Previous from "../services/previousButton";

import { AppContext } from "../context/AppContext";
import "../Styles/product.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { wishlist = [], addToWishlist } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [catalogue, setCatalogue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const [item, items] = await Promise.all([
          getCatalogueItem(id),
          getCatalogue("all"),
        ]);

        if (!active) return;

        setProduct(item?.published === true ? item : null);

        setCatalogue(
          items.filter((entry) => entry.published === true)
        );
      } catch (err) {
        console.error("Failed to load product:", err);

        if (active) {
          setError("Unable to load this product. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const productId = product?.id ?? product?._id;

  const isSaved =
    productId != null &&
    wishlist.some(
      (item) =>
        String(item.id ?? item._id) === String(productId)
    );

  const similarItems = catalogue.filter((item) => {
    const itemId = item.id ?? item._id;

    return (
      String(itemId) !== String(productId) &&
      item.category === product?.category &&
      Boolean(item.imageUrl)
    );
  });

  const otherItems = catalogue
    .filter((item) => {
      const itemId = item.id ?? item._id;

      return (
        String(itemId) !== String(productId) &&
        item.category !== product?.category &&
        Boolean(item.imageUrl)
      );
    })
    .slice(0, 8);

  const handleWishlist = () => {
    if (!product) return;
    addToWishlist(product);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} at Samanta E-Book Stall!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShareMessage("Product link copied!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareData.url);
          setShareMessage("Product link copied!");
        } catch {
          setShareMessage("Unable to share. Please copy the page URL.");
        }
      }
    }
  };

  if (loading) {
    return (
      <main className="product-page product-state">
        <div className="product-loader" />
        <p>Loading product details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-page product-state">
        <h2>Something went wrong</h2>
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-page product-state">
        <Package size={42} />
        <h2>Product not found</h2>
        <p>This product may be unavailable or unpublished.</p>
        <Link to="/products" className="product-back-link">
          Browse products
        </Link>
      </main>
    );
  }

  const price = Number(product.price);
  const hasPrice = product.price !== "" &&
    product.price != null &&
    Number.isFinite(price);

  const stockValue =
    product.stockStatus ??
    product.stockQuantity ??
    product.stock;

  const isOutOfStock =
    product.stockStatus === "out-of-stock" ||
    product.stockStatus === "out of stock" ||
    product.stock === false ||
    (typeof stockValue === "number" && stockValue <= 0);

  return (
    <main className="product-page">
      {/* PRODUCT OVERVIEW */}
      {/* MOBILE PRODUCT TOOLBAR */}
<div className="mobile-product-toolbar">
  <div className="mobile-toolbar-left">
    <Previous />
  </div>

  <span className="mobile-toolbar-title">
    Product Details
  </span>

  <button
    type="button"
    className="mobile-toolbar-share"
    onClick={handleShare}
    aria-label="Share product"
  >
    <Share2 size={20} />
  </button>
</div>

      <section className="product-detail-main">
        {/* LEFT: PRODUCT IMAGE */}
        <div className="product-gallery">
          <div className="product-image-frame">
            <img
              src={product.imageUrl}
              className="main-img"
              alt={product.title}
            />
          </div>
        </div>

        {/* RIGHT: PRODUCT INFORMATION */}
        <div className="product-right">
          <div className="product-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span className="breadcrumb-current">
              {product.title}
            </span>
          </div>

          <span className="product-category">
            {product.category || "General"}
          </span>

          <h1>{product.title}</h1>

          {product.author && (
            <p className="product-author">
              By <strong>{product.author}</strong>
            </p>
          )}

          <div className="product-divider" />

          {/* <div className="product-price-row">
            {hasPrice ? (
              <span className="product-price">
                ₹{price.toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="product-price-unavailable">
                Price available on request
              </span>
            )}
          </div> */}

          <div
            className={`product-stock ${
              isOutOfStock ? "out-of-stock" : "in-stock"
            }`}
          >
            <span className="stock-dot" />
            {isOutOfStock ? "Currently out of stock" : "Available"}
          </div>

          <div className="product-description">
            <h3>About this product</h3>
            <p>
              {product.description ||
                "No description is available for this product yet."}
            </p>
          </div>

          <div className="product-actions">
            
            <button
              type="button"
              className={`wishlist-btn ${isSaved ? "saved" : ""}`}
              onClick={handleWishlist}
              aria-pressed={isSaved}
            >
              {isSaved ? (
                <BookmarkCheck size={19} />
              ) : (
                <Bookmark size={19} />
              )}
              {isSaved ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>

            <button
              type="button"
              className="share-btn"
              onClick={handleShare}
            >
              {typeof navigator !== "undefined" && navigator.share ? (
                <Share2 size={19} />
              ) : (
                <Copy size={19} />
              )}
              Share
            </button>
          </div>

          {shareMessage && (
            <p className="share-message" role="status">
              {shareMessage}
            </p>
          )}

          {/* <div className="product-trust-note">
            <Package size={19} />
            <span>
              Discover more books and products from Samanta E-Book Stall.
            </span>
          </div> */}
        </div>
      </section>

      {/* SIMILAR PRODUCTS: SAME CATEGORY, IMAGE ONLY */}
      {similarItems.length > 0 && (
        <section className="product-recommendation">
          <div className="recommendation-heading">
            <div>
              <div className="product-divider" />
              <span className="section-eyebrow">YOU MAY ALSO LIKE</span>
              <h2>Similar Products</h2>
              <p>More from {product.category}</p>
            </div>
          </div>

          <div className="similar-grid">
            {similarItems.map((item) => (
              <Link
                to={`/product/${item.id ?? item._id}`}
                className="similar-card"
                key={item.id ?? item._id}
                title={item.title}
                aria-label={`View ${item.title}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* OTHER PRODUCTS: DIFFERENT CATEGORIES */}
      {otherItems.length > 0 && (
        <section className="product-recommendation other-products-section">
          <div className="recommendation-heading">
            <div>
              <span className="section-eyebrow">EXPLORE MORE</span>
              <h2>Other Products</h2>
              <p>Discover something different from our collection.</p>
            </div>

            <Link to="/recommendation" className="view-all-products">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="other-products-grid">
            {otherItems.map((item) => (
              <Link
                to={`/product/${item.id ?? item._id}`}
                className="other-product-card"
                key={item.id ?? item._id}
              >
                <div className="other-product-image">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>

                <div className="other-product-info">
                  <span>{item.category || "General"}</span>
                  <h3>{item.title}</h3>
{/* 
                  {item.price != null && item.price !== "" && (
                    <p>
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                  )} */}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
