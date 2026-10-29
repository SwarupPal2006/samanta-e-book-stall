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
  LayoutDashboard,
  BookOpenCheck,
  Search,
  SlidersHorizontal,
  Crown,
  ChevronDown,
  Pencil,
  Eye,
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
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    // Move directly to the edit form at the bottom of the dashboard.
    requestAnimationFrame(() => {
      document.getElementById("catalogue-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
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


  const filteredItems = items.filter((item) => {
    const matchesType = contentTypeFilter === "all" || item.type === contentTypeFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStock = stockFilter === "all" || (item.stockStatus || "") === stockFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && item.published === true) ||
      (statusFilter === "draft" && item.published !== true) ||
      (statusFilter === "bestseller" && item.type === "book" && item.bestseller === true);
    const needle = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !needle ||
      [item.title, item.author, item.category, item.type]
        .some((value) => String(value || "").toLowerCase().includes(needle));
    return matchesType && matchesCategory && matchesStock && matchesStatus && matchesSearch;
  });

  const categoryOptions = [...new Set(items.map((item) => item.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [contentTypeFilter, categoryFilter, stockFilter, statusFilter, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark"><Crown size={18} /></span>
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav" aria-label="Admin navigation">
          <button type="button" className="nav-item" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <LayoutDashboard size={17} /><span>Dashboard</span>
          </button>
          <button type="button" className="nav-item active" onClick={() => document.getElementById("catalogue-inventory")?.scrollIntoView({ behavior: "smooth" })}>
            <BookOpen size={17} /><span>Catalogue Management</span>
          </button>
          <div className="sidebar-spacer" />
          <button type="button" className="nav-item signout-nav-item" onClick={logout}>
            <LogOut size={17} /><span>Sign out</span>
          </button>
        </nav>

      </aside>

      <main className="admin-main">
        <header className="topbar">
          <div className="topbar-context"><span className="topbar-dot" /> Catalogue workspace</div>
          <div className="topbar-right">
            <div className="topbar-profile"><div className="profile-avatar">A</div>
            <div><strong>Admin</strong></div>
            <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <div className="admin-content">
          <header className="page-heading">
            <div>
              <span className="eyebrow">SAMANTA MANAGEMENT</span>
              <h1>Catalogue Management</h1>
              <p>Manage books, products, publishing status, and inventory.</p>
            </div>
            <button type="button" className="primary-button" onClick={() => { cancelEdit(); document.getElementById("catalogue-form")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span>＋</span> Add New Item
            </button>
          </header>

          <section className="stats-grid" aria-label="Catalogue summary">
            <article className="stat-card"><div className="stat-icon blue"><BookOpen size={19} /></div><div><span>Total items</span><strong>{items.length.toLocaleString()}</strong><small>Books and products</small></div></article>
            <article className="stat-card"><div className="stat-icon green"><Eye size={19} /></div><div><span>Published</span><strong>{published.toLocaleString()}</strong><small>Visible publicly</small></div></article>
            <article className="stat-card"><div className="stat-icon violet"><BookOpenCheck size={19} /></div><div><span>Books</span><strong>{books.toLocaleString()}</strong><small>Catalogue books</small></div></article>
            <article className="stat-card"><div className="stat-icon amber"><ShoppingBag size={19} /></div><div><span>Products</span><strong>{products.toLocaleString()}</strong><small>Catalogue products</small></div></article>
          </section>

          {message && <p className="admin-message" role="status">{message}</p>}

          <div className="workspace-grid">
            <div className="right-column catalogue-stack">
              <section className="panel inventory-panel" id="catalogue-inventory">
                <div className="panel-heading inventory-title"><div><h2>Category inventory</h2><p>Review, filter, and manage catalogue items.</p></div><span className="inventory-count">{filteredItems.length} items</span></div>

                <div className="inventory-toolbar">
                  <div className="search-field"><Search size={17} /><input aria-label="Search catalogue" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search title, author, category..." /></div>
                  <div className="filter-field"><label htmlFor="filter-content-type">Content type</label><select id="filter-content-type" value={contentTypeFilter} onChange={(event) => setContentTypeFilter(event.target.value)}><option value="all">All types</option><option value="book">Books</option><option value="product">Products</option></select></div>
                  <div className="filter-field"><label htmlFor="filter-category">Category <b>*</b></label><select id="filter-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select></div>
                  <div className="filter-field"><label htmlFor="filter-stock">Stock status <b>*</b></label><select id="filter-stock" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}><option value="all">All stock</option><option value="in-stock">In Stock</option><option value="out-of-stock">Out of Stock</option></select></div>
                  <div className="filter-field"><label htmlFor="filter-status">Visibility / feature</label><select id="filter-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="published">Published publicly</option><option value="draft">Draft / hidden</option><option value="bestseller">Bestselling books</option></select></div>
                  <button type="button" className="reset-filters" onClick={() => { setContentTypeFilter("all"); setCategoryFilter("all"); setStockFilter("all"); setStatusFilter("all"); setSearchTerm(""); }}><SlidersHorizontal size={15} /> Reset</button>
                </div>

                <div className="table-scroll">
                  <table className="inventory-table">
                    <thead><tr><th>Item</th><th>Content type</th><th>Category</th><th>Stock status</th><th>Visibility</th><th>Bestseller</th><th>Actions</th></tr></thead>
                    <tbody>
                      {paginatedItems.map((item) => <tr key={item.id}>
                        <td><div className="item-cell">{item.imageUrl ? <img src={item.imageUrl} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} /> : <div className="item-placeholder"><BookOpen size={17} /></div>}<div><strong>{item.title}</strong><span>{item.author || (item.type === "book" ? "Book catalogue item" : "Product catalogue item")}</span></div></div></td>
                        <td><span className={`type-pill ${item.type === "book" ? "book-pill" : "product-pill"}`}>{item.type === "book" ? "Book" : "Product"}</span></td>
                        <td>{item.category || "—"}</td>
                        <td><span className={`status-pill ${item.stockStatus === "in-stock" ? "stock-in" : item.stockStatus === "out-of-stock" ? "stock-out" : "stock-unknown"}`}><i />{item.stockStatus === "in-stock" ? "In Stock" : item.stockStatus === "out-of-stock" ? "Out of Stock" : "Not set"}</span></td>
                        <td><span className={`status-pill ${item.published ? "stock-in" : "stock-unknown"}`}><i />{item.published ? "Published" : "Draft"}</span></td>
                        <td>{item.type === "book" && item.bestseller ? <span className="bestseller-pill">Featured</span> : <span className="muted-value">—</span>}</td>
                        <td><div className="table-actions"><button type="button" onClick={() => edit(item)} aria-label={`Edit ${item.title}`} title="Edit"><Pencil size={15} /></button><button type="button" className="delete-button" onClick={() => deleteItem(item)} aria-label={`Delete ${item.title}`} title="Delete"><Trash2 size={15} /></button></div></td>
                      </tr>)}
                      {filteredItems.length === 0 && <tr><td colSpan="7" className="empty-table">No catalogue items match these filters.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="table-footer">
                  <span>Showing {filteredItems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} filtered items</span>
                  <div className="pagination-controls">
                    <button type="button" className="page-button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} aria-label="Previous page">‹</button>
                    <span className="page-number">{currentPage} / {pageCount}</span>
                    <button type="button" className="page-button" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={currentPage >= pageCount} aria-label="Next page">›</button>
                  </div>
                </div>
              </section>

              <div className="form-import-grid">
            <form className="panel item-form" id="catalogue-form" onSubmit={submit}>
              <div className="panel-heading"><div><h2>{editingId ? "Edit catalogue item" : "Add new item"}</h2><p>Complete the fields below to manage an item.</p></div><span className="heading-icon"><Pencil size={17} /></span></div>

              <label htmlFor="content-type">Content type <b>*</b></label>
              <select id="content-type" value={form.type} onChange={(event) => change("type", event.target.value)} required>
                <option value="book">Book</option><option value="product">Product</option>
              </select>

              <label htmlFor="item-title">Title / name <b>*</b></label>
              <input id="item-title" value={form.title} onChange={(event) => change("title", event.target.value)} placeholder="Enter title or product name" required />

              {form.type === "book" && <><label htmlFor="item-author">Author</label><input id="item-author" value={form.author || ""} onChange={(event) => change("author", event.target.value)} placeholder="Enter author name" /></>}

              <label htmlFor="item-category">Category <b>*</b></label>
              <select id="item-category" value={form.category} onChange={(event) => change("category", event.target.value)} required>
                <option value="">Select a category</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>

              <label htmlFor="item-description">Description</label>
              <textarea id="item-description" rows="3" value={form.description} onChange={(event) => change("description", event.target.value)} placeholder="Add a short description" />

              <label htmlFor="item-image-url">Cover / product image URL</label>
              <input id="item-image-url" type="url" value={form.imageUrl} onChange={(event) => change("imageUrl", event.target.value)} placeholder="https://example.com/image.jpg" />
              <p className="field-help">Paste a publicly accessible image URL. No file upload is required.</p>
              {form.imageUrl && <div className="admin-image-preview">{previewError ? <p><ImageIcon size={17} /> Preview unavailable. Check the URL.</p> : <img className="admin-preview" src={form.imageUrl} alt="Catalogue preview" onError={() => setPreviewError(true)} />}</div>}

              <label htmlFor="item-stock-status">Stock status <b>*</b></label>
              <select id="item-stock-status" value={form.stockStatus} onChange={(event) => change("stockStatus", event.target.value)} required>
                <option value="">Select stock status</option><option value="in-stock">In Stock</option><option value="out-of-stock">Out of Stock</option>
              </select>

              <div className="toggle-list">
                <label className="check-row"><input type="checkbox" checked={form.published} onChange={(event) => change("published", event.target.checked)} /><span><strong>Publish publicly</strong><small>Make this item visible on the public catalogue.</small></span></label>
                {form.type === "book" && <label className="check-row"><input type="checkbox" checked={form.bestseller} onChange={(event) => change("bestseller", event.target.checked)} /><span><strong>Feature in Bestselling Books</strong><small>Highlight this book in the bestseller section.</small></span></label>}
              </div>

              <div className="form-actions"><button disabled={busy} type="submit" className="primary-button">{busy ? "Please wait..." : editingId ? "Update item" : "Save item"}</button>{editingId && <button type="button" className="secondary-button" onClick={cancelEdit} disabled={busy}>Cancel edit</button>}</div>
            </form>

              <section className="panel import-panel">
                <div className="panel-heading"><div><h2>Bulk CSV import</h2><p>Import multiple books or products at once.</p></div><span className="heading-icon"><Upload size={17} /></span></div>
                <label htmlFor="csv-upload" className="upload-zone"><Upload size={21} /><strong>Choose a CSV file</strong><span>CSV format · Existing catalogue import logic</span><input id="csv-upload" type="file" accept=".csv,text/csv" onChange={handleCSV} disabled={busy} /></label>
                <a href="/catalogue-template.csv" download className="admin-download">Download CSV template</a>
              </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
