import React, { useState, useCallback, memo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Chip,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Timer as TimerIcon,
  Memory as MemoryIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle,
} from "@mui/icons-material";
import CodeEditor from "../components/CodeEditor";
import AIAssistant from "../components/AIAssistant";
import DiscussionForum from "../components/DiscussionForum";
import { useAuth } from "../contexts/AuthContext";
import { problemsAPI } from "../services/api";
import { executeCode } from "../services/codeExecutionService";

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  const [state, setState] = useState({
    problem: null,
    loading: true,
    error: null,
    userCode: "",
    language: "javascript",
    activeTab: 0,
    submissionResult: null,
    runResult: null,
    isRunning: false,
    showHints: false,
    showSolution: false,
    showApproach: false,
    testCases: [],
    submissions: [],
    progress: {
      attemptsCount: 0,
      passedTestsCount: 0,
      lastSubmissionTime: null,
      timeSpent: 0,
    },
    aiAnalysis: null,
    discussions: [],
    bookmarked: false,
    notes: "",
  });

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const fetchProblemData = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });

      const [
        problemResponse,
        submissionsResponse,
        progressResponse,
        discussionsResponse,
      ] = await Promise.all([
        problemsAPI.getProblem(id),
        problemsAPI.getUserSubmissions(id),
        problemsAPI.getProblemProgress(id),
        problemsAPI.getProblemDiscussions(id),
      ]);

      if (problemResponse.error) {
        throw new Error(problemResponse.error);
      }

      const problem = problemResponse.data;
      const starter = problem.starterCode;
      const userCode =
        typeof starter === "string" ? starter : starter?.[state.language] || "";

      updateState({
        problem,
        userCode,
        testCases: problem.testCases || [],
        submissions: submissionsResponse.data || [],
        progress: progressResponse.data || {
          attemptsCount: 0,
          passedTestsCount: 0,
          lastSubmissionTime: null,
          timeSpent: 0,
        },
        discussions: discussionsResponse.data || [],
        loading: false,
      });

      // Start tracking time spent
      startTimeTracking();
    } catch (err) {
      console.error("Error fetching problem data:", err);
      updateState({
        error: err.message || "Failed to fetch problem data",
        loading: false,
      });
    }
  }, [id, state.language, updateState]);

  const startTimeTracking = useCallback(() => {
    const interval = setInterval(() => {
      updateState((prev) => ({
        progress: {
          ...prev.progress,
          timeSpent: prev.progress.timeSpent + 1,
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [updateState]);

  useEffect(() => {
    fetchProblemData();

    // Cleanup function to save progress
    return () => {
      if (state.problem && state.progress.timeSpent > 0) {
        problemsAPI
          .updateProblemProgress(id, {
            timeSpent: state.progress.timeSpent,
            submissionCount: state.progress.attemptsCount,
          })
          .catch(console.error);
      }
    };
  }, [fetchProblemData, id, state.problem, state.progress]);

  // Update code when language changes
  useEffect(() => {
    if (state.problem?.starterCode) {
      const starter = state.problem.starterCode;
      const newCode =
        typeof starter === "string" ? starter : starter[state.language] || "";
      updateState({ userCode: newCode });
    }
  }, [state.language, state.problem, updateState]);

  // Save code to local storage
  useEffect(() => {
    if (state.userCode && id) {
      localStorage.setItem(`code_${id}_${state.language}`, state.userCode);
    }
  }, [state.userCode, id, state.language]);

  // Load code from local storage
  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${id}_${state.language}`);
    if (savedCode) {
      updateState({ userCode: savedCode });
    }
  }, [id, state.language, updateState]);

  const handleSubmit = async () => {
    if (typeof state.userCode !== "string" || !state.userCode.trim()) {
      updateState({ error: "Please write some code before submitting" });
      return;
    }

    try {
      updateState({ loading: true, error: null, submissionResult: null });

      // Submit solution
      const response = await problemsAPI.submitSolution(id, {
        code: state.userCode,
        language: state.language,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Update state with results
      updateState({
        submissionResult: response.data,
        progress: {
          ...state.progress,
          attemptsCount: state.progress.attemptsCount + 1,
          passedTestsCount: response.data.success
            ? state.progress.passedTestsCount + 1
            : state.progress.passedTestsCount,
          lastSubmissionTime: new Date().toISOString(),
        },
        submissions: [response.data, ...state.submissions],
      });

      // Show success message
      if (response.data.success) {
        // Get AI analysis of the successful solution
        const analysisResponse = await problemsAPI.getAIAnalysis(
          id,
          state.userCode,
          state.language
        );
        if (!analysisResponse.error) {
          updateState({ aiAnalysis: analysisResponse.data });
        }

        // Update user progress
        await problemsAPI.updateProblemProgress(id, {
          solved: true,
          timeSpent: state.progress.timeSpent,
          submissionCount: state.progress.attemptsCount,
        });
      }
    } catch (err) {
      console.error("Error submitting solution:", err);
      updateState({
        error: err.message || "Failed to submit solution",
        submissionResult: null,
      });
    } finally {
      updateState({ loading: false });
    }
  };

  const handleRunCode = async () => {
    if (typeof state.userCode !== "string" || !state.userCode.trim()) {
      updateState({ error: "Please write some code before running" });
      return;
    }

    try {
      updateState({ isRunning: true, runResult: null, error: null });

      // Run code with test cases
      const response = await executeCode({
        code: state.userCode,
        language: state.language,
        testCases: state.testCases,
        timeLimit: state.problem.timeLimit,
        memoryLimit: state.problem.memoryLimit,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Update state with results
      updateState({
        runResult: {
          output: response.output,
          testResults: response.testResults,
          executionTime: response.stats?.executionTime,
          memoryUsed: response.stats?.memoryUsed,
          status: response.success ? "success" : "failed",
        },
      });

      // If there are errors, get AI help
      if (!response.success && response.error) {
        const debugResponse = await problemsAPI.getAIDebug(
          id,
          state.userCode,
          state.language,
          response.error
        );
        if (!debugResponse.error) {
          updateState({ aiAnalysis: debugResponse.data });
        }
      }
    } catch (err) {
      console.error("Error running code:", err);
      updateState({
        runResult: { error: err.message || "Failed to run code" },
        error: err.message || "Failed to run code",
      });
    } finally {
      updateState({ isRunning: false });
    }
  };

  const handleTabChange = (event, newValue) => {
    updateState({ activeTab: newValue });
  };

  if (state.loading) {
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

  if (state.error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      </Container>
    );
  }

  if (!state.problem) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Problem not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {state.loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}>
          <CircularProgress />
        </Box>
      ) : state.error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Problem Header */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton
                  onClick={() => navigate("/problems")}
                  sx={{ mr: 2 }}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                  {state.problem?.title}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label={state.problem?.difficulty}
                    color={getDifficultyColor(state.problem?.difficulty)}
                    size="small"
                  />
                  <Chip
                    label={state.problem?.category}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
              <Typography variant="body1" component="div" sx={{ mb: 2 }}>
                {state.problem?.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Tooltip title="Time Complexity">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TimerIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {state.problem?.timeComplexity || "O(n)"}
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title="Space Complexity">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MemoryIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {state.problem?.spaceComplexity || "O(1)"}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Tabs value={state.activeTab} onChange={handleTabChange}>
                <Tab label="Code" />
                <Tab label="Discussion" />
                <Tab label="Submissions" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {state.activeTab === 0 && (
                  <Box>
                    <CodeEditor
                      code={state.userCode}
                      language={state.language}
                      onChange={(code) => updateState({ userCode: code })}
                      onLanguageChange={(language) => updateState({ language })}
                    />
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRunCode}
                        disabled={state.isRunning}
                        startIcon={<CodeIcon />}>
                        Run Code
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={state.loading}
                        startIcon={<CheckCircle />}>
                        Submit
                      </Button>
                    </Box>
                  </Box>
                )}
                {state.activeTab === 1 && (
                  <DiscussionForum
                    problemId={id}
                    discussions={state.discussions}
                    onDiscussionAdded={(discussion) =>
                      updateState({
                        discussions: [discussion, ...state.discussions],
                      })
                    }
                  />
                )}
                {state.activeTab === 2 && (
                  <Box>
                    <List>
                      {state.submissions.map((submission, index) => (
                        <React.Fragment key={submission.id || index}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Box
                                  component="div"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}>
                                  <Typography variant="body1">
                                    Submission #{index + 1}
                                  </Typography>
                                  <Chip
                                    label={submission.status}
                                    color={
                                      submission.status === "accepted"
                                        ? "success"
                                        : "error"
                                    }
                                    size="small"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box component="div" sx={{ mt: 1 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    {new Date(
                                      submission.timestamp
                                    ).toLocaleString()}
                                  </Typography>
                                  {submission.error && (
                                    <Typography variant="body2" color="error">
                                      {submission.error}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < state.submissions.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Attempts: {state.progress.attemptsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Spent: {Math.floor(state.progress.timeSpent / 60)}{" "}
                  minutes
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                AI Assistant
              </Typography>
              <AIAssistant
                problemId={id}
                code={state.userCode}
                language={state.language}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default memo(ProblemDetail);
