import "./App.css";
import { useEffect, useState } from "react";
import SearchPage from "./components/SearchPage";
import BookList from "./components/BookList";
import { Route, Routes } from "react-router-dom";
import * as booksAPI from "./BooksAPI";
import { bookShelfContext } from "./contexts/bookShelf";

function App() {
  const [books, setBooks] = useState([]);

  const updateShelf = () => (
    async () => {
      setBooks(await booksAPI.getAll());
    }
  )()

  useEffect(() => {
    updateShelf();
  }, [])

  return (
    <div className="app">
      <bookShelfContext.Provider value={{ updateShelf, books }}>
        <Routes>
          <Route exact path="/" element={<BookList books={books} />} />
          <Route exact path="/Search" element={<SearchPage />} />
        </Routes>
      </bookShelfContext.Provider>
    </div>
  );
}

export default App;
