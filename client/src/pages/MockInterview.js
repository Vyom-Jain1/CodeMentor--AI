import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import { Timer, Code, School } from "@mui/icons-material";

const MockInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interviewType, setInterviewType] = useState("technical");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState(45);

  const interviewTypes = [
    {
      type: "technical",
      title: "Technical Interview",
      description: "Practice coding and problem-solving questions",
      icon: <Code />,
    },
    {
      type: "system-design",
      title: "System Design",
      description: "Practice designing scalable systems",
      icon: <School />,
    },
    {
      type: "behavioral",
      title: "Behavioral Interview",
      description: "Practice answering behavioral questions",
      icon: <School />,
    },
  ];

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement interview start logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
    } catch (err) {
      setError(err.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mock Interview
      </Typography>
      <Typography variant="body1" paragraph>
        Practice your interview skills with our AI-powered mock interviews.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Interview Type Selection */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Interview Type
            </Typography>
            <Grid container spacing={2}>
              {interviewTypes.map((type) => (
                <Grid item xs={12} md={4} key={type.type}>
                  <Card
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      bgcolor:
                        interviewType === type.type
                          ? "action.selected"
                          : "background.paper",
                    }}
                    onClick={() => setInterviewType(type.type)}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        {type.icon}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {type.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Interview Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Interview Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Difficulty Level"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Duration (minutes)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Start Interview Button */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStartInterview}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Timer />}>
              {loading ? "Starting Interview..." : "Start Interview"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MockInterview;
