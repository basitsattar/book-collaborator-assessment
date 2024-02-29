import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { makeStyles } from "@material-ui/core/styles";
import Layout from "./Layout";
import Section from "./Section";

const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  subsectionContainer: {
    marginLeft: theme.spacing(2),
  },
  createBookButton: {
    marginTop: theme.spacing(2),
  },
}));

const CreateBook = () => {
  const classes = useStyles();
  const [bookTitle, setBookTitle] = useState("");
  const { getAllUsers, user } = useAuth();
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const { addBook } = useBook();
  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        try {
          const response = await getAllUsers();
          if (response) {
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
  const handleToggleCollaborator = useCallback((userId) => {
    setSelectedCollaborators((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  }, []);

  const uniqueId = useCallback(
    () => Math.random().toString(36).substr(2, 9),
    []
  );
  const [sections, setSections] = useState([
    {
      id: uniqueId(),
      title: "",
      description: "",
      subsections: [],
      level: 0,
      h: 0,
    },
  ]);

  const addSection = useCallback(() => {
    setSections((prevSections) => [
      ...prevSections,
      {
        id: uniqueId(),
        title: "",
        description: "",
        subsections: [],
        level: 0,
        h: prevSections.length + 0,
      },
    ]);
  }, [uniqueId]);

  const handleSectionChange = useCallback((id, field, value) => {
    const updateSections = (sections) =>
      sections.map((section) => {
        if (section.id === id) {
          return { ...section, [field]: value };
        }
        if (section.subsections.length) {
          return {
            ...section,
            subsections: updateSections(section.subsections),
          };
        }
        return section;
      });

    setSections(updateSections);
  }, []);

  const addSubsection = useCallback(
    (parentId) => {
      const insertSubsection = (sections) =>
        sections.map((section) => {
          if (section.id === parentId) {
            const newSubsection = {
              id: uniqueId(),
              title: "",
              description: "",
              subsections: [],
              level: section.level + 1,
            };
            return {
              ...section,
              subsections: [...section.subsections, newSubsection],
            };
          }
          if (section.subsections.length) {
            return {
              ...section,
              subsections: insertSubsection(section.subsections),
            };
          }
          return section;
        });

      setSections(insertSubsection);
    },
    [uniqueId]
  );

  const removeSection = useCallback((id) => {
    const removeSectionRecursive = (sections) =>
      sections.filter((section) => {
        if (section.id === id) return false;
        if (section.subsections.length) {
          section.subsections = removeSectionRecursive(section.subsections);
        }
        return true;
      });

    setSections(removeSectionRecursive);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    addBook({ title: bookTitle, sections, selectedCollaborators });
    navigate("/book-list");
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Create New Book
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Book Title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            fullWidth
            variant="outlined"
            required
            margin="normal"
          />
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
          {sections.map((section, index) => (
            <Section
              key={section.id}
              sectionData={section}
              onChange={handleSectionChange}
              hierarchy={`Section ${index + 1}`}
              onRemove={removeSection}
              onAddSubsection={addSubsection}
              isAuthor={true}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={addSection}
            className={classes.createBookButton}
          >
            Add Section
          </Button>
          <Box
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Create Book
            </Button>
          </Box>
        </form>
      </Container>
    </Layout>
  );
};

export default CreateBook;
