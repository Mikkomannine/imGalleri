import "../css/searchbar.css";
import {Link} from "react-router-dom";

export const SearchResult = ({ result, id, handleClick }) => {
  
    return (
        <Link to={`/post/${id}`} onClick={handleClick}>
        <h4>{result}</h4>
      </Link>
    );
};