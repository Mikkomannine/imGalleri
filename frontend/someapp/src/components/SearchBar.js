import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../css/searchbar.css";

export const SearchBar = ({setResults}) => {
    const [input, setInput] = useState("");

    const fetchData = (value) => {
        fetch("http://localhost:3001/api/media/")
            .then((response) => response.json())
            .then((json) => {
                const results = json.filter((post) => {
                    return (
                        value &&
                        post &&
                        post.title &&
                        post.title.toLowerCase().includes(value)
                    );
                });
                setResults(results);
                console.log(results);
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