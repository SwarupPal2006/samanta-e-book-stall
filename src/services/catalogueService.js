
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const catalogueRef = collection(db, "catalogue");

// Normalize form and CSV values before saving.
function normalizeItem(item = {}) {
  const stockStatus =
    item.stockStatus === "in-stock" ||
    item.stockStatus === "out-of-stock"
      ? item.stockStatus
      : "";

  return {
    type: String(item.type || "book").trim().toLowerCase(),
    title: String(item.title || "").trim(),
    category: String(item.category || "").trim(),
    description: String(item.description || "").trim(),
    imageUrl: String(item.imageUrl || "").trim(),
    author: String(item.author || "").trim(),
    price: Number(item.price) || 0,

    published:
      item.published === true ||
      String(item.published).trim().toLowerCase() === "true",

    bestseller:
      item.bestseller === true ||
      String(item.bestseller).trim().toLowerCase() === "true",

    stockStatus,
  };
}

// Validate a book or product before writing to Firestore.
function validateItem(item) {
  if (!["book", "product"].includes(item.type)) {
    throw new Error("Type must be book or product.");
  }

  if (!item.title) {
    throw new Error("Title is required.");
  }

  if (!Number.isFinite(item.price) || item.price < 0) {
    throw new Error("Price must be a valid non-negative number.");
  }

  if (item.imageUrl) {
    let url;

    try {
      url = new URL(item.imageUrl);
    } catch {
      throw new Error("Image URL is invalid.");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Image URL must use HTTP or HTTPS.");
    }
  }
}

// Fetch published books/products for the public website.
// Sorting is done in JavaScript to include older documents
// that might not have a createdAt field.
export async function getCatalogue(type = "all") {
  const constraints = [
    where("published", "==", true),
  ];

  if (type !== "all") {
    constraints.push(where("type", "==", type));
  }

  const snapshot = await getDocs(
    query(catalogueRef, ...constraints)
  );

  const items = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  items.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });

  return items;
}

// Fetch one published item for public product details.
// Admins can also fetch unpublished items.
export async function getCatalogueItem(id) {
  const snapshot = await getDoc(doc(db, "catalogue", id));

  if (!snapshot.exists()) {
    return null;
  }

  const item = {
    id: snapshot.id,
    ...snapshot.data(),
  };

  // Public users should only receive published items.
  // Firestore security rules must also enforce this.
  if (item.published !== true) {
    throw new Error(
      "This item is not published or you do not have permission to view it."
    );
  }

  return item;
}

// Create a new item or update an existing item.
// Only authenticated admins should be allowed by Firestore rules.
export async function saveCatalogueItem(item, id = null) {
  const data = normalizeItem(item);
  validateItem(data);

  if (id) {
    await updateDoc(doc(db, "catalogue", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return id;
  }

  const created = await addDoc(catalogueRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return created.id;
}

// Delete an item.
export async function removeCatalogueItem(id) {
  await deleteDoc(doc(db, "catalogue", id));
}

// Import CSV rows into Firestore.
export async function importCatalogueRows(rows) {
  const results = {
    imported: 0,
    failed: [],
  };

  for (let index = 0; index < rows.length; index++) {
    try {
      const item = normalizeItem(rows[index]);
      validateItem(item);

      await addDoc(catalogueRef, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      results.imported++;
    } catch (error) {
      results.failed.push({
        row: index + 2,
        title: rows[index]?.title || "(untitled)",
        error: error.message || "Import failed",
      });
    }
  }

  return results;
}
