
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const WISHLIST_KEY = "samanta-wishlist";

export const AppProvider = ({ children }) => {
  // Load saved wishlist from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save wishlist whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Could not save wishlist:", error);
    }
  }, [wishlist]);

  // Add or remove an item using the same function
  const addToWishlist = (book) => {
    const bookId = book?.id ?? book?._id;

    if (bookId == null) return;

    setWishlist((current) => {
      const exists = current.some(
        (item) =>
          String(item.id ?? item._id) === String(bookId)
      );

      if (exists) {
        return current.filter(
          (item) =>
            String(item.id ?? item._id) !== String(bookId)
        );
      }

      return [...current, { ...book, id: bookId }];
    });
  };

  // Check whether an item is already saved
  const isWishlisted = (book) => {
    const bookId = book?.id ?? book?._id;

    if (bookId == null) return false;

    return wishlist.some(
      (item) =>
        String(item.id ?? item._id) === String(bookId)
    );
  };

  // Remove an item directly
  const removeFromWishlist = (book) => {
    const bookId = book?.id ?? book?._id;

    if (bookId == null) return;

    setWishlist((current) =>
      current.filter(
        (item) =>
          String(item.id ?? item._id) !== String(bookId)
      )
    );
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <AppContext.Provider
      value={{
        wishlist,
        addToWishlist,
        onAddToWishlist: addToWishlist,
        isWishlisted,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
