import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import {
  Send as SendIcon,
  Lightbulb as HintIcon,
  Code as CodeIcon,
  Speed as SpeedIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { aiAPI } from "../services/api";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const AIAssistant = ({ problemId, onSuggestion }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  // For rate limiting and retry logic
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const MIN_REQUEST_INTERVAL = 1000; // 1 second

  const addMessage = (message, isUser = false) => {
    setMessages((prev) => [
      ...prev,
      { text: message, isUser, timestamp: new Date() },
    ]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCurrentAction = () => {
    switch (currentStep) {
      case 0:
        return "thinking";
      case 1:
        return "analyzing";
      case 2:
        return "suggesting";
      default:
        return "processing";
    }
  };

  const handleAIRequest = useCallback(
    async (endpoint, data = null) => {
      try {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;

        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
          );
        }

        setLastRequestTime(Date.now());
        const response = await endpoint(data);

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.error);
        }
      } catch (error) {
        console.error("AI request error:", error);
        throw error;
      }
    },
    [lastRequestTime]
  );

  const getHint = async () => {
    try {
      setLoading(true);
      setError(null);
      const hint = await handleAIRequest(() => aiAPI.getHint(problemId));
      addMessage(`💡 Hint: ${hint}`, false);
    } catch (error) {
      setError("Failed to get hint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getExplanation = async () => {
    try {
      setLoading(true);
      setError(null);
      const explanation = await handleAIRequest(() =>
        aiAPI.getExplanation(problemId)
      );
      addMessage("Here's an explanation of the problem:", false);
      addMessage(explanation.approach, false);
      explanation.steps.forEach((step) => {
        addMessage(`• ${step}`, false);
      });
    } catch (error) {
      setError("Failed to get explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage(userMessage, true);

    try {
      setLoading(true);
      setError(null);
      const response = await handleAIRequest(() => aiAPI.chat(userMessage));
      addMessage(response.text, false);

      if (response.codeSnippet) {
        addMessage("```javascript\n" + response.codeSnippet + "\n```", false);
      }

      if (response.suggestions?.length > 0) {
        addMessage("Here are some suggestions:", false);
        response.suggestions.forEach((suggestion) => {
          addMessage(`• ${suggestion}`, false);
        });
      }
    } catch (error) {
      setError("Failed to get response. Please try again.");
      addMessage("Sorry, I encountered an error. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={getHint}
          startIcon={<HintIcon />}
          disabled={loading}>
          Get Hint
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={getExplanation}
          startIcon={<CodeIcon />}
          disabled={loading}>
          Get Explanation
        </Button>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 1,
          p: 2,
          mb: 2,
          minHeight: "300px",
          maxHeight: "calc(70vh - 180px)",
        }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: message.isUser ? "flex-end" : "flex-start",
              mb: 2,
            }}>
            <Paper
              sx={{
                p: 2,
                maxWidth: "85%",
                bgcolor: message.isUser ? "primary.main" : "background.default",
                color: message.isUser ? "primary.contrastText" : "text.primary",
                boxShadow: 2,
              }}>
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}>
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}>
                {message.text}
              </ReactMarkdown>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 1,
          mt: "auto",
        }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Ask me anything about the problem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          sx={{ bgcolor: "background.paper" }}
        />
        <IconButton
          color="primary"
          type="submit"
          disabled={loading || !input.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AIAssistant;
