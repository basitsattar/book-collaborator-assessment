import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BookProvider } from "./contexts/BookContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import BookLists from "./pages/BookLists";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CollaboratorList from "./pages/CollaboratorList";
import CreateBook from "./components/CreateBook";
import UpdateBook from "./components/UpdateBook";
import UpdateRole from "./components/UpdateRole";

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/book-list" element={<PrivateRoute />}>
              <Route index element={<BookLists />} />
            </Route>
            <Route path="/update-book/:bookId" element={<PrivateRoute />}>
              <Route index element={<UpdateBook />} />
            </Route>
            <Route path="/create-book" element={<PrivateRoute />}>
              <Route index element={<CreateBook />} />
            </Route>
            <Route path="/collaborators" element={<PrivateRoute />}>
              <Route index element={<CollaboratorList />} />
            </Route>
            <Route path="/update-role/:userId" element={<PrivateRoute />}>
              <Route index element={<UpdateRole />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BookProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
