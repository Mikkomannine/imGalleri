import { useState } from "react";
import "../css/searchbar.css";
import { SearchResult } from "./searchResult";

export const SearchResultsList = ({ results }) => {
  const [isVisible, setIsVisible] = useState(true);


  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  return isVisible ? (

    <div className="results-list">
      {results.map((result, id) => {
        return (
          <SearchResult
            result={result.title}
            key={id}
            id={result._id}
            handleClick={handleClick}
          />
        );
      })}
    </div>
  ) : null;
};