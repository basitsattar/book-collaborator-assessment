import React from "react";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBook } from "../contexts/BookContext";
import Layout from "../components/Layout";

const CollaboratorList = () => {
  const { books } = useBook();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userBooks = books.filter((book) => {
    return book.collaborators && book.collaborators.includes(user.id);
  });

  const goToUpdateBookPage = (bookId) => {
    navigate(`/update-book/${bookId}`);
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Collaboration Books Lists
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="book table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell component="th" scope="row">
                    {book.title}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => goToUpdateBookPage(book.id)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default CollaboratorList;
