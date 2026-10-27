
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Upload,
  BookOpen,
  ShoppingBag,
  Trash2,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";

import { auth, db } from "../services/firebase";
import {
  saveCatalogueItem,
  removeCatalogueItem,
  importCatalogueRows,
} from "../services/catalogueService";

import "../Styles/Admin.css";
import categories  from "../data/categories";

const emptyForm = {
  type: "book",
  title: "",
  category: "",
  description: "",
  author: "",
  price: "",
  imageUrl: "",
  published: true,
  bestseller: false,
  stockStatus: "in-stock",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [previewError, setPreviewError] = useState(false);

  async function refresh() {
    const snapshot = await getDocs(
      query(collection(db, "catalogue"), orderBy("createdAt", "desc"))
    );

    setItems(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  }

  useEffect(() => {
    refresh().catch((error) => setMessage(error.message));
  }, []);

  function change(key, value) {
    setForm((old) => ({ ...old, [key]: value }));

    if (key === "imageUrl") {
      setPreviewError(false);
    }
  }

  function edit(item) {
    setEditingId(item.id);

    setForm({
  ...emptyForm,
  ...item,
  price: item.price ?? "",
  imageUrl: item.imageUrl || "",
  bestseller: item.bestseller === true,
  stockStatus:
    item.stockStatus === "in-stock" ||
    item.stockStatus === "out-of-stock"
      ? item.stockStatus
      : "",
});

    setPreviewError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setPreviewError(false);
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const imageUrl = form.imageUrl.trim();

      if (imageUrl) {
        let url;

        try {
          url = new URL(imageUrl);
        } catch {
          throw new Error("Please enter a valid image URL.");
        }

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Image URL must start with HTTP or HTTPS.");
        }
      }

      await saveCatalogueItem(
        {
          ...form,
          imageUrl,
          imagePath: "",
          price: form.type === "product" ? Number(form.price) : 0,
        },
        editingId
      );

      cancelEdit();
      setMessage("Catalogue item saved successfully.");
      await refresh();
    } catch (error) {
      setMessage(error.message || "Could not save the catalogue item.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    try {
      await removeCatalogueItem(item.id);
      setItems((old) => old.filter((entry) => entry.id !== item.id));
      setMessage("Item deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Could not delete the item.");
    }
  }

  async function handleCSV(event) {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    setBusy(true);
    setMessage("");

    try {
      const result = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          complete: resolve,
          error: reject,
        });
      });

      if (result.errors.length) {
        throw new Error(
          `CSV parsing error: ${result.errors[0].message}`
        );
      }

      const required = [
        "type",
        "title",
        "category",
        "description",
        "published",
      ];

      const missing = required.filter(
        (key) => !result.meta.fields?.includes(key)
      );

      if (missing.length) {
        throw new Error(`Missing CSV columns: ${missing.join(", ")}`);
      }

      if (!result.data.length) {
        throw new Error("The CSV file contains no data rows.");
      }

      const outcome = await importCatalogueRows(result.data);

      setMessage(
        `Imported ${outcome.imported} rows. ${outcome.failed.length} failed.` +
          (outcome.failed.length
            ? ` First error: ${
                outcome.failed[0].error ||
                outcome.failed[0].message ||
                "Unknown error"
              }`
            : "")
      );

      await refresh();
    } catch (error) {
      setMessage(error.message || "CSV import failed.");
    } finally {
      setBusy(false);
      input.value = "";
    }
  }

  async function logout() {
    await signOut(auth);
    navigate("/admin/login");
  }

  const books = items.filter((item) => item.type === "book").length;
  const products = items.filter((item) => item.type === "product").length;
  const published = items.filter((item) => item.published === true).length;

  return (
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">SAMANTA MANAGEMENT</span>
          <h1>Admin Dashboard</h1>
          <p>Manage your books and product catalogue.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={logout}
        >
          <LogOut size={17} /> Sign out
        </button>
      </header>

      <div className="admin-stats">
        <article>
          <BookOpen />
          <span>Books</span>
          <strong>{books}</strong>
        </article>

        <article>
          <ShoppingBag />
          <span>Products</span>
          <strong>{products}</strong>
        </article>

        <article>
          <Upload />
          <span>Published</span>
          <strong>{published}</strong>
        </article>
      </div>

      {message && (
        <p className="admin-message" role="status">
          {message}
        </p>
      )}

      <div className="admin-grid">
        <form className="admin-panel" onSubmit={submit}>
          <h2>{editingId ? "Edit item" : "Add new item"}</h2>

          <label htmlFor="content-type">Content type</label>
          <select
            id="content-type"
            value={form.type}
            onChange={(event) => change("type", event.target.value)}
          >
            <option value="book">Book</option>
            <option value="product">Product</option>
          </select>

          <label htmlFor="item-title">Title / name *</label>
          <input
            id="item-title"
            value={form.title}
            onChange={(event) => change("title", event.target.value)}
            required
          />

          {form.type === "book" && (
            <>
              <label htmlFor="item-author">Author</label>
              <input
                id="item-author"
                value={form.author || ""}
                onChange={(event) => change("author", event.target.value)}
              />
            </>
          )}

          {/* {form.type === "product" && (
            <>
              <label htmlFor="item-price">Price (₹)</label>
              <input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => change("price", event.target.value)}
                required
              />
            </>
          )} */}

          <label htmlFor="item-category">Category *</label>
          <select
  id="item-category"
  value={form.category}
  onChange={(event) => change("category", event.target.value)}
  required
>
  <option value="">Select a category</option>

  {categories.map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>

          <label htmlFor="item-description">Description</label>
          <textarea
            id="item-description"
            rows="4"
            value={form.description}
            onChange={(event) =>
              change("description", event.target.value)
            }
          />

          <label htmlFor="item-image-url">Cover / product image URL</label>
          <input
            id="item-image-url"
            type="url"
            value={form.imageUrl}
            onChange={(event) => change("imageUrl", event.target.value)}
            placeholder="https://example.com/image.jpg"
          />

          <p className="image-url-help">
            Paste a publicly accessible image URL. No file upload is required.
          </p>

          {form.imageUrl && (
            <div className="admin-image-preview">
              {previewError ? (
                <p>
                  <ImageIcon size={17} /> Preview unavailable. Check the URL.
                </p>
              ) : (
                <img
                  className="admin-preview"
                  src={form.imageUrl}
                  alt="Catalogue preview"
                  onError={() => setPreviewError(true)}
                />
              )}
            </div>
          )}
          <label htmlFor="item-stock-status">Stock status *</label>

<select
  id="item-stock-status"
  value={form.stockStatus}
  onChange={(event) =>
    change("stockStatus", event.target.value)
  }
  required
>
  <option value="">Select stock status</option>
  <option value="in-stock">In Stock</option>
  <option value="out-of-stock">Out of Stock</option>
</select>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => change("published", event.target.checked)}
            />
            Publish publicly
          </label>
          {form.type === "book" && (
    <label className="admin-checkbox">
    <input
      type="checkbox"
      checked={form.bestseller}
      onChange={(event) =>
        change("bestseller", event.target.checked)
      }
    />
    Feature in Bestselling Books
  </label>
)}

          <button disabled={busy} type="submit">
            {busy
              ? "Please wait..."
              : editingId
                ? "Update item"
                : "Save item"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={cancelEdit}
              disabled={busy}
            >
              Cancel edit
            </button>
          )}
        </form>

        <section className="admin-panel">
          <h2>Bulk CSV import</h2>
          <p>
            Import multiple books or products from a CSV file. Image URLs can
            be included in the CSV.
          </p>

          <label htmlFor="csv-upload">Choose CSV file</label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            onChange={handleCSV}
            disabled={busy}
          />

          <a
            href="/catalogue-template.csv"
            download
            className="admin-download"
          >
            Download CSV template
          </a>

          <h2 className="inventory-heading">Catalogue inventory</h2>

          <div className="inventory-list">
            {items.map((item) => (
              <article key={item.id} className="inventory-item">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                )}

                <div className="inventory-info">
                  <strong>{item.title}</strong>
                  <span>
                    {item.type} · {item.published ? "Published" : "Draft"}
                  </span>

                  <div className="inventory-actions">
                    <button
                      type="button"
                      onClick={() => edit(item)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteItem(item)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {items.length === 0 && <p>No catalogue items yet.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}
