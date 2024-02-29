import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Link, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }

    if (!email || !password) {
      setError("Please provide both email and password");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to log in");
    }
  };

  const navigateToSignup = () => {
    navigate("/signup");
  };

  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <Box
          sx={{
            maxWidth: "400px",
            width: "100%",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              error={emailError}
              helperText={emailError && "Email is required"}
              sx={{ mb: 2 }}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              error={passwordError}
              helperText={passwordError && "Password is required"}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
            >
              Login
            </Button>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link href="#" onClick={navigateToSignup}>
                Sign Up
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
  );
};

export default Login;
