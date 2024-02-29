import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Box,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  PersonOutline as PersonOutlineIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component={Link}
              to="/dashboard"
              sx={{ color: "#FFF", textDecoration: "none", marginRight: 2 }}
            >
              Book Collaborator
            </Typography>
            {user && (
              <div>
                <Typography
                  variant="h6"
                  component={Link}
                  to="/book-list"
                  style={{
                    color: "#FFF",
                    textDecoration: "none",
                    marginLeft: "50px",
                    marginRight: "50px",
                  }}
                >
                  My Books
                </Typography>
              </div>
            )}

            {user && (
              <IconButton
                component={Link}
                to="/collaborators"
                sx={{ color: "#FFF" }}
              >
                <PersonOutlineIcon sx={{ color: "white" }} />
                <Typography
                  variant="h6"
                  component={Link}
                  to="/collaborators"
                  sx={{ color: "#FFF", textDecoration: "none", marginLeft: 1 }}
                >
                  Collaboration
                </Typography>
              </IconButton>
            )}
          </Box>
          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={logout} sx={{ color: "#FFF" }}>
                <ExitToAppIcon sx={{ color: "white" }} />
              </IconButton>
              <Typography
                variant="h6"
                component="span"
                onClick={logout}
                sx={{
                  color: "#FFF",
                  textDecoration: "none",
                  cursor: "pointer",
                  marginLeft: 1,
                }}
              >
                Logout
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 2, mb: 2 }}>
        <main>{children}</main>
      </Container>
      <footer
        style={{
          padding: "20px 0",
          color: "#FFF",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <Typography variant="body2">
          Book Collaboration Platform © 2024
        </Typography>
      </footer>
    </div>
  );
};

export default Layout;
