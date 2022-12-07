import { useEffect, useRef, useState, useContext } from "react";
import * as booksAPI from "../BooksAPI";
import { bookShelfContext } from "../contexts/bookShelf";


const Book = ({book}) => {
    const [shelf, setShelf] = useState(book.shelf || "none")
    const origShelf = useRef();
    const context = useContext(bookShelfContext);
    const [isSaving, SetIsSaving] = useState(false);

    const updateBook = (book, shelf) => {
        SetIsSaving(true);
        (async () => {
            await booksAPI.update(book, shelf);
            context.updateShelf();
            SetIsSaving(false);
            origShelf.current = shelf;
        })();
    }

    useEffect(() => {
        origShelf.current = book.shelf || "none";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setShelf(e.target.value)
        if (origShelf.current !== e.target.value) {
            updateBook(book, e.target.value);
        }
    }

    return (
        <div className="book">
            <div className="book-top">
                <div
                    className="book-cover"
                    style={{
                        width: 128,
                        height: 192,
                        backgroundImage: `url(${book.imageLinks?.smallThumbnail}`,
                    }}
                >
                    {isSaving &&
                        <div style={{backgroundColor: "#000000aa", color: "white", textAlign: "center"}}>Saving</div>
                    }
                </div>
                <div className="book-shelf-changer">
                    <select value={shelf} onChange={(e) => handleChange(e)}>
                        <option disabled>
                            Move to...
                        </option>
                        <option value="currentlyReading">
                            Currently Reading
                        </option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                    </select>
                </div>
            </div>
            <div className="book-title">
                {book.title}
            </div>
            <div className="book-authors">{book.authors?.join(" - ")}</div>
        </div>
    )
}

export default Book;