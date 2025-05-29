import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon,
  Save as SaveIcon,
  SmartToy as SmartToyIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { codeAPI } from "../services/api";

// Debounce function to limit resize handler calls
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const SUPPORTED_LANGUAGES = [
  { id: "python", name: "Python", extension: ".py" },
  { id: "javascript", name: "JavaScript", extension: ".js" },
  { id: "java", name: "Java", extension: ".java" },
  { id: "cpp", name: "C++", extension: ".cpp" },
];

// Local AI Assistant Service
const analyzeCode = (code, language) => {
  // This is a simple local code analysis function
  // You can expand this with more sophisticated analysis
  const analysis = {
    suggestions: [],
    potentialIssues: [],
    improvements: [],
  };

  // Basic code analysis
  if (code.length === 0) {
    analysis.suggestions.push("Start writing your code!");
    return analysis;
  }

  // Check for common issues
  if (code.includes("while(true)")) {
    analysis.potentialIssues.push("Potential infinite loop detected");
  }

  if (code.includes("eval(")) {
    analysis.potentialIssues.push(
      "Use of eval() is generally discouraged for security reasons"
    );
  }

  // Language-specific analysis
  if (language === "python") {
    if (
      code.includes("print(") &&
      !code.includes("if __name__ == '__main__':")
    ) {
      analysis.improvements.push(
        "Consider using if __name__ == '__main__': for script execution"
      );
    }
  } else if (language === "javascript") {
    if (code.includes("var ")) {
      analysis.improvements.push(
        "Consider using 'let' or 'const' instead of 'var'"
      );
    }
  }

  return analysis;
};

const CodeEditor = ({
  initialCode = "",
  problemId = null,
  onSubmit = null,
  readOnly = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [editorMounted, setEditorMounted] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorDidMount = (editor, monaco) => {
    setEditorMounted(true);

    // Add cleanup for resize observer
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        editor.layout();
      }, 100)
    );

    const editorElement = editor.getDomNode();
    if (editorElement) {
      resizeObserver.observe(editorElement);
    }

    return () => {
      if (editorElement) {
        resizeObserver.unobserve(editorElement);
      }
      resizeObserver.disconnect();
    };
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleThemeChange = () => {
    setTheme(theme === "vs-dark" ? "light" : "vs-dark");
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleRun = async () => {
    try {
      setLoading(true);
      setError(null);
      setOutput("");

      const response = await codeAPI.runCode({
        code,
        language,
        input,
      });

      if (response.data.success) {
        setOutput(response.data.data.stdout);
        if (response.data.data.stderr) {
          setError(response.data.data.stderr);
        }
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to execute code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problemId || !onSubmit) return;

    try {
      setLoading(true);
      setError(null);
      setExecutionResult(null);

      const response = await codeAPI.submitSolution(problemId, {
        code,
        language,
      });

      if (response.data.success) {
        setExecutionResult(response.data.data);
        if (response.data.data.allPassed) {
          onSubmit(true);
        }
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit solution");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCode = () => {
    setIsAnalyzing(true);
    try {
      const analysis = analyzeCode(code, language);
      setAiAnalysis(analysis);
      setShowAiPanel(true);
    } catch (err) {
      setError("Failed to analyze code");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 200px)", // Fixed height with space for header/footer
        maxHeight: "calc(100vh - 200px)", // Maximum height
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: "hidden", // Prevent overflow
      }}>
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            label="Language"
            onChange={handleLanguageChange}
            disabled={readOnly}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <MenuItem key={lang.id} value={lang.id}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button size="small" onClick={handleThemeChange} variant="outlined">
          Toggle Theme
        </Button>
        {!readOnly && (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={handleRun}
              disabled={loading}>
              Run
            </Button>
            {problemId && (
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}>
                Submit
              </Button>
            )}
          </>
        )}
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SmartToyIcon />}
          onClick={handleAnalyzeCode}
          disabled={loading || isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "AI Assistant"}
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          position: "relative",
          minHeight: 0, // Allow box to shrink
          overflow: "hidden", // Contain the editor
        }}>
        <Editor
          height="100%" // Use 100% of parent height
          defaultLanguage="python"
          language={language}
          theme={theme}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 16,
            lineHeight: 1.5,
            readOnly,
            scrollBeyondLastLine: false,
            automaticLayout: true, // Enable automatic layout
            wordWrap: "on",
            padding: { top: 10, bottom: 10 },
          }}
        />
      </Box>

      {!readOnly && (
        <Box sx={{ display: "flex", gap: 2, flexShrink: 0, height: "150px" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Input
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              size="small"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter input here..."
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Output
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                height: "100%",
                bgcolor: "background.default",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                overflowY: "auto",
              }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : (
                output || "No output"
              )}
            </Paper>
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {executionResult && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>
          {executionResult.results.map((result, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color={result.passed ? "success.main" : "error.main"}>
                Test Case {index + 1}: {result.passed ? "Passed" : "Failed"}
              </Typography>
              {!result.passed && (
                <>
                  <Typography variant="body2">Input: {result.input}</Typography>
                  <Typography variant="body2">
                    Expected: {result.expectedOutput}
                  </Typography>
                  <Typography variant="body2">
                    Got: {result.actualOutput}
                  </Typography>
                </>
              )}
            </Box>
          ))}
          {executionResult.allPassed && (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              All test cases passed! Great job!
            </Alert>
          )}
        </Paper>
      )}

      <Collapse in={showAiPanel}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">AI Assistant Analysis</Typography>
            <IconButton
              onClick={() => setShowAiPanel(false)}
              size="small"
              sx={{ ml: "auto" }}>
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {aiAnalysis && (
            <>
              {aiAnalysis.potentialIssues.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="warning.main"
                    gutterBottom>
                    Potential Issues:
                  </Typography>
                  {aiAnalysis.potentialIssues.map((issue, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                      • {issue}
                    </Typography>
                  ))}
                </Box>
              )}

              {aiAnalysis.improvements.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="info.main"
                    gutterBottom>
                    Suggested Improvements:
                  </Typography>
                  {aiAnalysis.improvements.map((improvement, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                      • {improvement}
                    </Typography>
                  ))}
                </Box>
              )}

              {aiAnalysis.suggestions.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="success.main"
                    gutterBottom>
                    Suggestions:
                  </Typography>
                  {aiAnalysis.suggestions.map((suggestion, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                      • {suggestion}
                    </Typography>
                  ))}
                </Box>
              )}
            </>
          )}
        </Paper>
      </Collapse>
    </Box>
  );
};

export default CodeEditor;
