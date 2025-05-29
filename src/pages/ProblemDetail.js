import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import CodeEditor from "../components/CodeEditor";
import {
  getProblem,
  submitSolution,
  getSupportedLanguages,
} from "../services/api";

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemData, languagesData] = await Promise.all([
          getProblem(id),
          getSupportedLanguages(),
        ]);
        setProblem(problemData);
        setLanguages(languagesData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load problem data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const submissionResult = await submitSolution(id, { code, language });
      setResult(submissionResult);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!problem) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6">Problem not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {problem.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Difficulty: {problem.difficulty} | Category: {problem.category}
        </Typography>
        <Typography variant="body1" paragraph>
          {problem.description}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}>
              {languages.map((lang) => (
                <MenuItem key={lang.id} value={lang.id}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <CodeEditor
          code={code}
          language={language}
          onChange={setCode}
          readOnly={!user}
        />

        {result && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: result.success ? "success.light" : "error.light",
            }}>
            <Typography
              color={
                result.success ? "success.contrastText" : "error.contrastText"
              }>
              {result.message}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!user || submitting || !code.trim()}>
            {submitting ? <CircularProgress size={24} /> : "Submit Solution"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProblemDetail;
