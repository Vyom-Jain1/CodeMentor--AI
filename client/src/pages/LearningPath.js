import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
} from "@mui/material";
import { progressAPI } from "../services/api";

const categories = [
  {
    name: "Arrays and Strings",
    description: "Master fundamental data structures and string manipulation",
    problems: [],
  },
  {
    name: "Linked Lists",
    description: "Learn about linked list operations and common patterns",
    problems: [],
  },
  {
    name: "Trees and Graphs",
    description: "Explore tree and graph traversal algorithms",
    problems: [],
  },
  {
    name: "Dynamic Programming",
    description: "Understand dynamic programming concepts and patterns",
    problems: [],
  },
  {
    name: "Sorting and Searching",
    description: "Learn efficient sorting and searching algorithms",
    problems: [],
  },
];

const LearningPath = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getProgress();
      setProgress(response.data.data.progress);

      // Calculate active step based on completed problems
      const completedCategories = new Set(
        response.data.data.progress.completedProblems.map((p) => p.category)
      );
      const currentStep = categories.findIndex(
        (category) =>
          !completedCategories.has(
            category.name.toLowerCase().replace(/\s+/g, "-")
          )
      );
      setActiveStep(currentStep === -1 ? categories.length : currentStep);
    } catch (error) {
      setError("Error loading learning path. Please try again.");
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryProgress = (categoryName) => {
    if (!progress) return 0;
    const categoryProblems = progress.completedProblems.filter(
      (p) => p.category === categoryName.toLowerCase().replace(/\s+/g, "-")
    );
    return (categoryProblems.length / 5) * 100; // Assuming 5 problems per category
  };

  if (loading) {
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Learning Path
      </Typography>

      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {categories.map((category, index) => (
            <Step key={index}>
              <StepLabel>{category.name}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Current Category */}
      {activeStep < categories.length && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Current Focus: {categories[activeStep].name}
          </Typography>
          <Typography variant="body1" paragraph>
            {categories[activeStep].description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Progress in this category
            </Typography>
            <LinearProgress
              variant="determinate"
              value={calculateCategoryProgress(categories[activeStep].name)}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Button variant="contained" onClick={() => navigate("/problems")}>
            Start Practicing
          </Button>
        </Paper>
      )}

      {/* All Categories */}
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {category.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateCategoryProgress(category.name)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={`${Math.round(
                      calculateCategoryProgress(category.name)
                    )}% Complete`}
                    color="primary"
                    size="small"
                  />
                  {index < activeStep && (
                    <Chip label="Completed" color="success" size="small" />
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate("/problems")}>
                  {index === activeStep
                    ? "Continue Learning"
                    : "Review Problems"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LearningPath;
