import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Grid } from "@mui/material";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <Grid container direction="column" alignItems="center" mt={5} spacing={2}>
        <Grid item>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to the Book Collaboration Platform
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" gutterBottom align="center">
            This platform allows you to create, edit, and collaborate on books
            with others.
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;
