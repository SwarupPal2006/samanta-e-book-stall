import { useEffect, useState } from "react";
import { getCatalogue } from "../services/catalogueService";
import SearchBar from "../components/SearchBar";
// import BookCard from "../components/BookCard";

export default function Search() {
  const [catalogue, setCatalogue] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCatalogue() {
      try {
        const items = await getCatalogue("all");

        if (active) {
          setCatalogue(items);
          setResults(items);
        }
      } catch (err) {
        console.error("Failed to load catalogue:", err);
        if (active) setError("Unable to load the catalogue.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCatalogue();

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (value) => {
    const query = String(value || "").trim().toLowerCase();

    if (!query) {
      setResults(catalogue);
      return;
    }

    setResults(
      catalogue.filter((item) =>
        [
          item.title,
          item.author,
          item.category,
          item.description,
        ].some((field) =>
          String(field || "").toLowerCase().includes(query)
        )
      )
    );
  };

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} />

      {/* {loading && <p>Loading catalogue...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p>No matching books or products found.</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {results.map((item) => (
            <BookCard key={item.id} book={item} />
          ))}
        </div>
      )} */}
    </div>
  );
}