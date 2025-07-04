import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../css/searchbar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  const fetchData = (value) => {
    fetch(`${API_BASE}/api/media/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject("Unauthorized");
        }
        return response.json();
      })
      .then((json) => {
        if (!json) return;
        const results = json.filter((post) => {
          return (
            value &&
            post &&
            post.title &&
            post.title.toLowerCase().includes(value)
          );
        });
        setResults(results);
      })
      .catch((err) => {
        if (err !== "Unauthorized") {
          console.error("Search error:", err);
        }
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};