import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
const BookContext = createContext();
const API_URL = "http://localhost:3001";
export const BookProvider = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/books`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);
  const addBook = async (book) => {
    const newBook = {
      id: Date.now().toString(),
      title: book.title,
      sections: book.sections || [],
      userId: user.id,
      collaborators: book.selectedCollaborators,
    };
    try {
      const response = await axios.post(`${API_URL}/books`, newBook);
      if (response) setBooks((prevBooks) => [...prevBooks, newBook]);
    } catch (error) {
      console.error("Error adding new book:", error);
    }
  };

  const updateBook = async (bookId, updatedBook, selectedCollaborators) => {
    const updateBook = {
      title: updatedBook.title,
      sections: updatedBook.sections || [],
      collaborators: selectedCollaborators ? selectedCollaborators : [],
    };
    try {
      const response = await axios.patch(
        `${API_URL}/books/${bookId}`,
        updateBook
      );
      if (response)
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            parseInt(book.id) === parseInt(bookId)
              ? { ...book, ...updateBook }
              : book
          )
        );
    } catch (error) {
      console.error("Error occor while updating the book:", error);
    }
  };

  const getBookById = (bookId) => {
    return books.find((book) => parseInt(book.id) === parseInt(bookId));
  };

  const addSection = (bookId, section) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id === bookId) {
          const newSection = {
            id: Date.now(),
            title: section.title,
            description: section.description,
            subsections: [],
          };
          return {
            ...book,
            sections: [...book.sections, newSection],
          };
        }
        return book;
      })
    );
  };

  const addSubsection = (bookId, sectionId, subsection) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id === bookId) {
          return {
            ...book,
            sections: book.sections.map((section) => {
              if (section.id === sectionId) {
                const newSubsection = {
                  id: Date.now(),
                  title: subsection.title,
                  description: subsection.description,
                };
                return {
                  ...section,
                  subsections: [...section.subsections, newSubsection],
                };
              }
              return section;
            }),
          };
        }
        return book;
      })
    );
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        getBookById,
        addSection,
        addSubsection,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => useContext(BookContext);
