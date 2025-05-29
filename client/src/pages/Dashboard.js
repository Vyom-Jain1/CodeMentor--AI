import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user.name}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Progress
            </Typography>
            <Typography variant="body1">
              Problems Solved: {user.stats?.totalSolved || 0}
            </Typography>
            <Typography variant="body1">
              Success Rate:{" "}
              {Math.round(
                ((user.stats?.correctSubmissions || 0) /
                  (user.stats?.totalSubmissions || 1)) *
                  100
              )}
              %
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Learning Path
            </Typography>
            <Typography variant="body1">
              Current Category:{" "}
              {user.progress?.currentCategory
                ? user.progress.currentCategory
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not started"}
            </Typography>
            <Typography variant="body1">
              Completed Problems:{" "}
              {user.progress?.completedProblems?.length || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
