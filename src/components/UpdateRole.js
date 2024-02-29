import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

const UpdateRole = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { updateUserRole, getUserById } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setNewRole(userData.role); // Set the initial role to the user's current role
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user data.");
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateUserRole(userId, newRole);
      navigate("/collaborators");
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Failed to update user role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Update Role
        </Typography>
        {user && (
          <div>
            <Typography variant="h6">Username: {user.name}</Typography>
            <Typography variant="body1">User ID: {userId}</Typography>
          </div>
        )}
        <Select
          label="New Role"
          variant="outlined"
          fullWidth
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          margin="normal"
        >
          <MenuItem value="visitor">Visitor</MenuItem>
          <MenuItem value="collaborator">Collaborator</MenuItem>
        </Select>
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!newRole || loading}
          style={{ marginTop: "20px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Update Role"}
        </Button>
      </div>
    </Layout>
  );
};

export default UpdateRole;
