import React, { useState, useEffect, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Alert,
  Collapse,
  CircularProgress,
  Snackbar,
  Tooltip,
  Divider,
  Grid,
  Fade,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BugReportIcon from "@mui/icons-material/BugReport";
import SpeedIcon from "@mui/icons-material/Speed";
import { codeAPI, aiAPI } from "../services/api";

const SUPPORTED_LANGUAGES = [
  {
    id: "python",
    name: "Python",
    extension: ".py",
    defaultTemplate:
      'def solution(nums):\n    """\n    Write your solution here\n    Args:\n        nums: List[int] - Input array\n    Returns:\n        int - Result\n    """\n    # Write your code here\n    pass\n',
    testTemplate:
      'def test_solution():\n    assert solution([1, 2, 3]) == 6\n    print("All test cases passed!")\n',
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    defaultTemplate:
      "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction solution(nums) {\n    // Write your code here\n}\n",
    testTemplate:
      'function testSolution() {\n    console.assert(solution([1, 2, 3]) === 6);\n    console.log("All test cases passed!");\n}\n',
  },
  {
    id: "java",
    name: "Java",
    extension: ".java",
    defaultTemplate:
      "public class Solution {\n    /**\n     * @param nums Array of integers\n     * @return Result\n     */\n    public static int solution(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        // Test your solution here\n    }\n}",
    testTemplate:
      "@Test\npublic void testSolution() {\n    int[] nums = {1, 2, 3};\n    assertEquals(6, Solution.solution(nums));\n}\n",
  },
  {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    defaultTemplate:
      "#include <vector>\n\nclass Solution {\npublic:\n    /**\n     * @param nums Vector of integers\n     * @return Result\n     */\n    int solution(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};",
    testTemplate:
      'void testSolution() {\n    Solution s;\n    vector<int> nums = {1, 2, 3};\n    assert(s.solution(nums) == 6);\n    cout << "All test cases passed!" << endl;\n}\n',
  },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background:
    theme.palette.mode === "dark"
      ? "rgba(30, 30, 30, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0,0,0,0.5)"
        : "0 8px 32px rgba(0,0,0,0.1)",
  },
}));

const EditorWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "70vh",
  ".monaco-editor": {
    padding: "12px",
    borderRadius: "16px",
    "&:hover": {
      ".margin-view-overlays": {
        background:
          theme.palette.mode === "dark"
            ? "rgba(40, 40, 40, 0.95)"
            : "rgba(248, 250, 252, 0.95)",
      },
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #2563EB, #059669, #2563EB)",
    backgroundSize: "200% 100%",
    animation: "gradient 4s linear infinite",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover::before": {
    opacity: 1,
  },
  "@keyframes gradient": {
    "0%": { backgroundPosition: "0% 0%" },
    "100%": { backgroundPosition: "200% 0%" },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "12px 24px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  textTransform: "none",
  fontWeight: 600,
  letterSpacing: "0.5px",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(45deg, rgba(37,99,235,0.8), rgba(5,150,105,0.8))"
      : "linear-gradient(45deg, #2563EB, #059669)",
  backgroundSize: "200% 100%",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    backgroundPosition: "100% 0%",
  },
  "&:active": {
    transform: "translateY(1px)",
  },
  "&.MuiButton-outlined": {
    background: "none",
    borderWidth: "2px",
    "&:hover": {
      borderWidth: "2px",
      background:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.05)",
    },
  },
}));

const OutputBox = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(30,30,30,0.95)"
      : "rgba(248,250,252,0.95)",
  borderRadius: 16,
  padding: theme.spacing(3),
  fontFamily: '"Fira Code", monospace',
  fontSize: "0.9rem",
  maxHeight: "250px",
  overflowY: "auto",
  position: "relative",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)",
    borderRadius: "8px",
    "&:hover": {
      background:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.3)"
          : "rgba(0,0,0,0.3)",
    },
  },
  "& pre": {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
}));

const CodeEditor = ({
  code,
  setCode,
  language,
  setLanguage,
  readOnly = false,
  problemId,
  testCases = [],
  socket,
  roomId,
}) => {
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const handleEditorDidMount = (editor, monaco) => {
    // Editor initialization logic
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    const template =
      SUPPORTED_LANGUAGES.find((lang) => lang.id === newLanguage)
        ?.defaultTemplate || "";
    if (!code) {
      setCode(template);
    }
  };

  const handleRunCode = async () => {
    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const input = (customInput || selectedTestCase?.input || "").toString();
      const response = await codeAPI.runCode({
        code,
        language,
        input,
        problemId,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setOutput(response.output);

      if (response.testResults) {
        setTestCaseResults(
          response.testResults.map((result) => ({
            ...result,
            status: result.passed ? "success" : "error",
            message: result.passed
              ? "Passed"
              : `Failed: ${result.error || "Wrong answer"}`,
          }))
        );
      }
    } catch (err) {
      setError(err.message);
      setTestCaseResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setOutput("");

    try {
      if (
        !problemId ||
        typeof problemId !== "string" ||
        problemId.trim() === ""
      ) {
        throw new Error("No problem selected");
      }
      const response = await codeAPI.submitSolution(problemId, {
        code,
        language,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Update test results
      if (response.testResults) {
        setTestCaseResults(
          response.testResults.map((result) => ({
            ...result,
            status: result.passed ? "success" : "error",
            message: result.passed
              ? "Passed"
              : `Failed: ${result.error || "Wrong answer"}`,
          }))
        );
      }

      // Show submission stats
      if (response.stats) {
        setOutput(
          `Submission successful!\n\nExecution Time: ${response.stats.executionTime}ms\nMemory Used: ${response.stats.memoryUsed}MB\nStatus: ${response.stats.status}\nPassed: ${response.stats.passedTests}/${response.stats.totalTests} tests`
        );
      }

      // Get solution stats
      const statsResponse = await codeAPI.getSolutionStats(problemId);
      if (statsResponse.error) {
        console.error("Failed to fetch solution stats:", statsResponse.error);
      } else {
        setOutput(
          (prev) =>
            `${prev}\n\nYour solution is:\n- Faster than ${statsResponse.fasterThan}% of submissions\n- More memory efficient than ${statsResponse.memoryEfficient}% of submissions`
        );
      }
    } catch (err) {
      setError(err.message);
      setTestCaseResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCode = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      if (!code || typeof code !== "string" || code.trim() === "") {
        throw new Error("Code cannot be empty");
      }
      if (!language || typeof language !== "string" || language.trim() === "") {
        throw new Error("Language cannot be empty");
      }
      const [analysisResponse, optimizationResponse] = await Promise.all([
        aiAPI.analyzeCode(code, language),
        aiAPI.improveCode(code, language),
      ]);

      if (analysisResponse.error) {
        throw new Error(analysisResponse.error);
      }

      const analysis = {
        potentialIssues: [],
        improvements: [],
        suggestions: [],
        complexity: {
          time: "Unknown",
          space: "Unknown",
        },
        explanation: "",
      };

      // Process analysis response
      if (analysisResponse.analysis) {
        analysis.potentialIssues = analysisResponse.analysis.issues || [];
        analysis.complexity =
          analysisResponse.analysis.complexity || analysis.complexity;
        analysis.explanation = analysisResponse.analysis.explanation || "";
      }

      // Process optimization response
      if (optimizationResponse && !optimizationResponse.error) {
        analysis.improvements = optimizationResponse.improvements || [];
        analysis.suggestions = optimizationResponse.suggestions || [];
      }

      setAiAnalysis(analysis);
      setShowAiPanel(true);

      // If there are errors in the code, offer to debug
      if (analysis.potentialIssues.length > 0) {
        const shouldDebug = window.confirm(
          "Issues found in your code. Would you like AI to help debug them?"
        );
        if (shouldDebug) {
          await handleDebugCode();
        }
      }
    } catch (err) {
      setError(err.message);
      setShowAiPanel(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDebugCode = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      if (!code || typeof code !== "string" || code.trim() === "") {
        throw new Error("Code cannot be empty");
      }
      if (!language || typeof language !== "string" || language.trim() === "") {
        throw new Error("Language cannot be empty");
      }
      const response = await aiAPI.debugCode(code, language, error || "");

      if (response.error) {
        throw new Error(response.error);
      }

      setAiAnalysis((prev) => ({
        ...prev,
        debugSuggestions: response.suggestions || [],
        fixedCode: response.fixedCode,
        explanation: response.explanation || prev.explanation,
      }));

      if (response.fixedCode) {
        const shouldApply = window.confirm(
          "AI has suggested fixes for your code. Would you like to apply them?"
        );
        if (shouldApply) {
          setCode(response.fixedCode);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper elevation={3}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel
                      sx={{
                        fontWeight: 500,
                        "&.Mui-focused": { fontWeight: 600 },
                      }}>
                      Language
                    </InputLabel>
                    <Select
                      value={language}
                      onChange={handleLanguageChange}
                      label="Language"
                      disabled={readOnly}
                      sx={{
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      }}>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <MenuItem
                          key={lang.id}
                          value={lang.id}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            my: 0.5,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "action.hover",
                              transform: "translateX(4px)",
                            },
                          }}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}>
                    <Tooltip title="Run Code" arrow TransitionComponent={Zoom}>
                      <ActionButton
                        variant="contained"
                        onClick={handleRunCode}
                        disabled={loading || readOnly}
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <PlayArrowIcon />
                          )
                        }>
                        Run
                      </ActionButton>
                    </Tooltip>
                    <Tooltip
                      title="Submit Solution"
                      arrow
                      TransitionComponent={Zoom}>
                      <ActionButton
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || readOnly || !problemId}
                        startIcon={<SaveIcon />}>
                        Submit
                      </ActionButton>
                    </Tooltip>
                    <Tooltip
                      title="AI Analysis"
                      arrow
                      TransitionComponent={Zoom}>
                      <ActionButton
                        variant="outlined"
                        onClick={handleAnalyzeCode}
                        disabled={isAnalyzing || readOnly}
                        startIcon={
                          isAnalyzing ? (
                            <CircularProgress size={20} />
                          ) : (
                            <SmartToyIcon />
                          )
                        }>
                        Analyze
                      </ActionButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ opacity: 0.6 }} />
            <EditorWrapper>
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={setCode}
                options={{
                  readOnly,
                  minimap: { enabled: true },
                  fontSize: 15,
                  lineHeight: 1.6,
                  padding: { top: 20, bottom: 20 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: true,
                  cursorBlinking: "smooth",
                  renderWhitespace: "selection",
                  fontFamily: '"Fira Code", monospace',
                  fontLigatures: true,
                  bracketPairColorization: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  autoIndent: "full",
                  renderLineHighlight: "all",
                }}
                onMount={handleEditorDidMount}
              />
              {loading && (
                <Fade in={loading}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(4px)",
                      zIndex: 1,
                    }}>
                    <CircularProgress size={50} />
                  </Box>
                </Fade>
              )}
            </EditorWrapper>
          </StyledPaper>
        </Grid>

        <Grid item xs={12}>
          <Collapse in={Boolean(error || output)} timeout={400}>
            <StyledPaper elevation={3}>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}>
                  <SpeedIcon /> Output
                </Typography>
                <OutputBox>
                  {error ? (
                    <Fade in={Boolean(error)}>
                      <Alert
                        severity="error"
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          "& .MuiAlert-icon": {
                            fontSize: "1.5rem",
                          },
                        }}>
                        {error}
                      </Alert>
                    </Fade>
                  ) : null}
                  {output && (
                    <Fade in={Boolean(output)}>
                      <pre>{output}</pre>
                    </Fade>
                  )}
                </OutputBox>
              </Box>
            </StyledPaper>
          </Collapse>
        </Grid>

        {testCases.length > 0 && (
          <Grid item xs={12}>
            <StyledPaper elevation={3}>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}>
                  <BugReportIcon /> Test Cases
                </Typography>
                <Grid container spacing={2}>
                  {testCases.map((testCase, index) => (
                    <Grid item xs={12} key={index}>
                      <Zoom
                        in={true}
                        style={{ transitionDelay: `${index * 100}ms` }}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 3,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            borderRadius: 2,
                            borderWidth: 2,
                            "&:hover": {
                              transform: "translateX(8px) translateY(-2px)",
                              borderColor: "primary.main",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            },
                          }}
                          onClick={() => setSelectedTestCase(testCase)}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 600 }}>
                            Test Case #{index + 1}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: '"Fira Code", monospace' }}>
                            Input: {testCase.input}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: '"Fira Code", monospace' }}>
                            Expected: {testCase.expected}
                          </Typography>
                          {testCaseResults[index] && (
                            <Fade in={true}>
                              <Alert
                                severity={testCaseResults[index].status}
                                sx={{
                                  mt: 2,
                                  borderRadius: 1.5,
                                  "& .MuiAlert-icon": {
                                    fontSize: "1.25rem",
                                  },
                                }}>
                                {testCaseResults[index].message}
                              </Alert>
                            </Fade>
                          )}
                        </Paper>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </StyledPaper>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}>
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            "& .MuiAlert-icon": {
              fontSize: "1.5rem",
            },
          }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CodeEditor;
