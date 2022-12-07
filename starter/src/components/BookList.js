import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Shelf from "./Shelf";

const defaultShelves = () => {
    return {
        currentlyReading: [],
        wantToRead: [],
        read: [],
    }
}

const BookList = ({books}) => {
    const [shelves, setShelves] = useState(defaultShelves())

    useEffect(() => {
        let _shelves = defaultShelves();
        for (let i = 0; i < books.length; i++) {
            let book = books[i];
            _shelves[book.shelf].push(book);
        }
        setShelves(() => _shelves);
    }, [books])

    return (
        <div className="list-books">
            <div className="list-books-title">
                <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
                <div>
                    <Shelf books={shelves.currentlyReading} shelfTitle="Current Reading" />
                    <Shelf books={shelves.wantToRead} shelfTitle="Want to Read" />
                    <Shelf books={shelves.read} shelfTitle="Read" />
                </div>
            </div>
            <div className="open-search">
                <Link to="/Search">Search A Book</Link>
            </div>
        </div>
    )
}

export default BookList;