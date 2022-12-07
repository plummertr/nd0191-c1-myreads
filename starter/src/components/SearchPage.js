import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import * as BooksAPI from "../BooksAPI";
import Book from "./Book";
import { bookShelfContext } from "../contexts/bookShelf";
import { randomSearchTerm } from "../random/whitelisted";

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [bookResults, setBookResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false); 

    const context = useContext(bookShelfContext);

    const timeout = useRef();

    useEffect(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        if (query.length > 0) {

            setIsSearching(true);
            timeout.current = setTimeout(() => {
                (async () => {
                    let result = await BooksAPI.search(query, 100)
                    if (result.error) {
                        if (result.error === "empty query") {
                            setBookResults([]);
                            setIsSearching(false);
                        }
                        return;
                    }
                    for (let i = 0; i < result.length; i++) {
                        let b = result[i];
                        let f = context.books.filter(ob => ob.id === b.id);
                        if (f.length) {
                            b.shelf = f[0].shelf;
                        }
                    }
                    await setBookResults(result)
                    setIsSearching(false);

                })()
            }, 300);
        } else {
            setTimeout(() => setBookResults([]), 0);
            setIsSearching(false);
        }

    }, [query, context.books])

    return (
        <div className="search-books">
            <div className="search-books-bar">
                <Link to="/" className="close-search">
                    Close
                </Link>
                <div className="search-books-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="search-books-results">
                <ol className="books-grid">
                    {bookResults.length > 0 && query.length > 0 ?  
                        bookResults.map(book => <Book key={book.id} book={book} />)
                    :
                        query.length > 0 && !isSearching ? 
                            <div className="no-results">
                                No results found (or the search term isn't whitelisted).
                            </div>
                        :
                        query.length === 0 &&
                            <div className="no-results">
                                Try searching {randomSearchTerm()}
                            </div>
                    }
                </ol>
            </div>
        </div>
    )
}

export default SearchPage