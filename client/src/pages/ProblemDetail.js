import React, { useState, useCallback, memo, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import CodeEditor from "../components/CodeEditor";
import AIAssistant from "../components/AIAssistant";
import DiscussionForum from "../components/DiscussionForum";
import { useAuth } from "../context/AuthContext";
import { problemsAPI } from "../services/api";
import { executeCode } from "../services/codeExecutionService";

const ProblemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState(0);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const fetchProblem = useCallback(async () => {
    try {
      setLoading(true);
      const response = await problemsAPI.getProblem(id);
      setProblem(response.data.data);
      const starter = response.data.data.starterCode;
      setUserCode(
        typeof starter === "string"
          ? starter
          : starter && starter[language]
          ? starter[language]
          : ""
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch problem");
    } finally {
      setLoading(false);
    }
  }, [id, language]);

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  useEffect(() => {
    if (problem && problem.starterCode) {
      const starter = problem.starterCode;
      setUserCode(
        typeof starter === "string" ? starter : starter[language] || ""
      );
    }
  }, [language, problem]);

  const handleSubmit = async () => {
    if (typeof userCode !== "string" || !userCode.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setSubmissionResult(null);
      const response = await problemsAPI.submitSolution(id, {
        code: userCode,
        language,
      });
      setSubmissionResult(response.data);
      if (response.data.success) {
        setError(null);
      } else {
        setError(response.data.error || "Failed to submit solution");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit solution");
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    if (typeof userCode !== "string" || !userCode.trim()) return;
    try {
      setIsRunning(true);
      setRunResult(null);
      const response = await executeCode(
        userCode,
        language,
        problem.testCases || []
      );
      setRunResult(response);
    } catch (err) {
      setRunResult({ error: err.message || "Failed to run code" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!problem) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Problem not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {problem.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {problem.description}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Difficulty: {problem.difficulty}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Category: {problem.category}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <CodeEditor
              code={typeof userCode === "string" ? userCode : ""}
              language={language}
              onChange={setUserCode}
              onLanguageChange={setLanguage}
            />
            <Box sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {submissionResult && submissionResult.success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Solution submitted successfully!
                </Alert>
              )}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRunCode}
                  disabled={
                    typeof userCode !== "string" ||
                    !userCode.trim() ||
                    isRunning
                  }
                  aria-label="Run code"
                  sx={{ mr: 2 }}>
                  {isRunning ? (
                    <CircularProgress size={24} aria-hidden="true" />
                  ) : (
                    "Run Code"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={loading}>
                  Submit Solution
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="AI Assistant" />
              <Tab label="Discussion" />
            </Tabs>
            <Box sx={{ flexGrow: 1, minHeight: "70vh", overflow: "auto" }}>
              {activeTab === 0 ? (
                <AIAssistant problemId={id} />
              ) : (
                <DiscussionForum problemId={id} />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(ProblemDetail);
