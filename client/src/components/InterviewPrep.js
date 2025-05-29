import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  VideoCall as VideoCallIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { problemsAPI } from "../services/api";

const companies = [
  { name: "Google", color: "#4285F4" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Meta", color: "#1877F2" },
  { name: "Apple", color: "#A2AAAD" },
  { name: "Netflix", color: "#E50914" },
];

const InterviewPrep = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyProblems, setCompanyProblems] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [createInterviewDialog, setCreateInterviewDialog] = useState(false);
  const [newInterview, setNewInterview] = useState({
    type: "technical",
    duration: 45,
    difficulty: "medium",
  });

  useEffect(() => {
    fetchMockInterviews();
  }, []);

  const fetchMockInterviews = async () => {
    try {
      setLoading(true);
      const { data } = await problemsAPI.getMockInterviews();
      setMockInterviews(data);
    } catch (err) {
      setError("Failed to fetch mock interviews");
      console.error("Error fetching mock interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = async (company) => {
    try {
      setLoading(true);
      setSelectedCompany(company);
      const { data } = await problemsAPI.getCompanyProblems(company);
      setCompanyProblems(data);
    } catch (err) {
      setError("Failed to fetch company problems");
      console.error("Error fetching company problems:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInterview = async () => {
    try {
      const { data } = await problemsAPI.createMockInterview(newInterview);
      setMockInterviews([data, ...mockInterviews]);
      setCreateInterviewDialog(false);
      navigate(`/interview/mock/${data._id}`);
    } catch (err) {
      setError("Failed to create mock interview");
      console.error("Error creating mock interview:", err);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Interview Preparation
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Company-specific Problems */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Company-specific Problems
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {companies.map((company) => (
            <Grid item key={company.name}>
              <Chip
                icon={<BusinessIcon />}
                label={company.name}
                onClick={() => handleCompanySelect(company.name)}
                sx={{
                  bgcolor:
                    selectedCompany === company.name
                      ? company.color
                      : "default",
                  color: selectedCompany === company.name ? "white" : "default",
                }}
              />
            </Grid>
          ))}
        </Grid>

        {selectedCompany && (
          <Grid container spacing={2}>
            {companyProblems.map((problem) => (
              <Grid item xs={12} md={6} key={problem._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {problem.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph>
                      {problem.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Chip
                        label={problem.difficulty}
                        color={
                          problem.difficulty === "easy"
                            ? "success"
                            : problem.difficulty === "medium"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                      <Chip
                        label={problem.category}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/problems/${problem._id}`)}>
                      Practice Problem
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Mock Interviews */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}>
          <Typography variant="h6">Mock Interviews</Typography>
          <Button
            variant="contained"
            startIcon={<VideoCallIcon />}
            onClick={() => setCreateInterviewDialog(true)}>
            Start New Interview
          </Button>
        </Box>

        <Grid container spacing={2}>
          {mockInterviews.map((interview) => (
            <Grid item xs={12} md={6} key={interview._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {interview.type.charAt(0).toUpperCase() +
                      interview.type.slice(1)}{" "}
                    Interview
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <TimerIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Duration"
                        secondary={`${interview.duration} minutes`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Difficulty"
                        secondary={interview.difficulty}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Status"
                        secondary={interview.status}
                      />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(`/interview/mock/${interview._id}`)
                    }>
                    {interview.status === "completed"
                      ? "View Results"
                      : "Continue Interview"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Create Interview Dialog */}
      <Dialog
        open={createInterviewDialog}
        onClose={() => setCreateInterviewDialog(false)}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Create Mock Interview</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Interview Type</InputLabel>
              <Select
                value={newInterview.type}
                label="Interview Type"
                onChange={(e) =>
                  setNewInterview({ ...newInterview, type: e.target.value })
                }
                id="interview-type-select"
                aria-label="Select interview type">
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="behavioral">Behavioral</MenuItem>
                <MenuItem value="system-design">System Design</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Duration</InputLabel>
              <Select
                value={newInterview.duration}
                label="Duration"
                onChange={(e) =>
                  setNewInterview({ ...newInterview, duration: e.target.value })
                }
                id="interview-duration-select"
                aria-label="Select interview duration">
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={45}>45 minutes</MenuItem>
                <MenuItem value={60}>60 minutes</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={newInterview.difficulty}
                label="Difficulty"
                onChange={(e) =>
                  setNewInterview({
                    ...newInterview,
                    difficulty: e.target.value,
                  })
                }
                id="interview-difficulty-select"
                aria-label="Select interview difficulty">
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateInterviewDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateInterview} variant="contained">
            Start Interview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewPrep;
