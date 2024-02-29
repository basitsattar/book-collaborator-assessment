import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:3001";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response) {
          const filterUsers = response.filter(
            (userData) => userData.id !== user.id
          );
          setUsers(filterUsers);
        }
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.get(`${API_URL}/users?email=${email}`, {
        email,
        password,
      });

      if (response) {
        const userInfo = {
          id: response.data[0].id,
          name: response.data[0].name,
          email: response.data[0].email,
        };
        localStorage.setItem("user", JSON.stringify(userInfo)); // Persist user's auth state
        setUser(userInfo);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/users`, {
        name,
        email,
        password,
        role: "author",
      });

      const userInfo = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      };
      localStorage.setItem("user", JSON.stringify(userInfo)); // Persist user's auth state
      setUser(userInfo); // Log in user immediately after registration
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.error("Error while getting users:", error);
      alert("Error while getting users. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user"); // Remove user's auth state from storage
    setUser(null);
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await axios.patch(`${API_URL}/users/${userId}`, {
        role: newRole,
      });
      if (response) {
        console.log("updated user role:");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new Error("Failed to update user role. Please try again.");
    }
  };
  const getUserById = async (userId) => {
    try {
      const response = await axios.patch(`${API_URL}/users/${userId}`);
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new Error("Failed to update user role. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        getAllUsers,
        updateUserRole,
        getUserById,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
