import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBook } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import Layout from "./Layout";
import Section from "./Section";

const UpdateBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { getBookById, updateBook } = useBook();
  const { user, getAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [book, setBook] = useState({ title: "", sections: [] });
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        try {
          const response = await getAllUsers();
          if (response && user) {
            const filterUsers = response.filter(
              (userData) => userData.id !== user.id
            );
            setUsers(filterUsers);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    const bookData = getBookById(bookId);
    if (bookData) {
      setBook(bookData);
      setSelectedCollaborators(bookData.collaborators);
    }
  }, [bookId, getBookById]);

  const handleChange = useCallback((field, value) => {
    setBook((prevBook) => ({ ...prevBook, [field]: value }));
  }, []);

  const handleSectionChange = useCallback((sectionId, field, value) => {
    setBook((prevBook) => {
      const updateSection = (sections) =>
        sections.map((section) => {
          if (section.id === sectionId) {
            return { ...section, [field]: value };
          } else if (section.subsections) {
            return {
              ...section,
              subsections: updateSection(section.subsections),
            };
          }
          return section;
        });

      return { ...prevBook, sections: updateSection(prevBook.sections) };
    });
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      updateBook(bookId, book, selectedCollaborators);
      navigate("/book-list");
    },
    [book, bookId, navigate, updateBook, selectedCollaborators]
  );

  // Corrected to modify the book state
  const addSection = useCallback(() => {
    setBook((prevBook) => ({
      ...prevBook,
      sections: [
        ...prevBook.sections,
        {
          id: Date.now(),
          title: "",
          description: "",
          subsections: [],
          level: 0,
          h: prevBook.sections.length + 1,
        },
      ],
    }));
  }, []);

  const removeSection = useCallback((sectionId) => {
    setBook((prevBook) => ({
      ...prevBook,
      sections: removeSectionRecursive(prevBook.sections, sectionId),
    }));
  }, []);

  const removeSectionRecursive = (sections, sectionId) =>
    sections.reduce((acc, section) => {
      if (section.id === sectionId) {
        return acc;
      } else {
        const updatedSection = {
          ...section,
          subsections: removeSectionRecursive(section.subsections, sectionId),
        };
        return [...acc, updatedSection];
      }
    }, []);

  const addSubsection = useCallback((parentId) => {
    setBook((prevBook) => {
      const addSubsectionRecursive = (sections) =>
        sections.map((section) => {
          if (section.id === parentId) {
            return {
              ...section,
              subsections: [
                ...section.subsections,
                {
                  id: Date.now(),
                  title: "",
                  description: "",
                  subsections: [],
                  level: section.level + 1,
                },
              ],
            };
          } else if (section.subsections.length) {
            return {
              ...section,
              subsections: addSubsectionRecursive(section.subsections),
            };
          }
          return section;
        });

      return {
        ...prevBook,
        sections: addSubsectionRecursive(prevBook.sections),
      };
    });
  }, []);

  const handleToggleCollaborator = useCallback((userId) => {
    setSelectedCollaborators((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  }, []);

  return (
    <Layout>
      <Container style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Update Book
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Book Title"
            value={book.title}
            onChange={(e) => handleChange("title", e.target.value)}
            variant="outlined"
            fullWidth
            required
            margin="normal"
          />
          {book.userId === user.id && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Select Collaborators
              </Typography>
              {users.map((user) => (
                <FormControlLabel
                  key={user.id}
                  control={
                    <Checkbox
                      checked={selectedCollaborators.includes(user.id)}
                      onChange={() => handleToggleCollaborator(user.id)}
                      color="primary"
                    />
                  }
                  label={user.name}
                />
              ))}
            </Box>
          )}
          {book.sections.map((section, index) => (
            <Section
              key={section.id || index}
              sectionData={section}
              onChange={handleSectionChange}
              onAddSubsection={addSubsection}
              onRemove={removeSection}
              hierarchy={`Section ${index + 1}`}
              isAuthor={book.userId === user.id ? true : false}
            />
          ))}
          {book.userId === user.id && (
            <Box style={{ marginTop: "20px" }}>
              <Button variant="contained" color="primary" onClick={addSection}>
                Add Section
              </Button>
            </Box>
          )}
          <Box
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Update Book
            </Button>
          </Box>
        </form>
      </Container>
    </Layout>
  );
};

export default UpdateBook;
