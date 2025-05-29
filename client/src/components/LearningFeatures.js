import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  PlayCircle as PlayIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { problemsAPI } from "../services/api";

const LearningFeatures = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [problem, setProblem] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [visualizations, setVisualizations] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchProblemData();
  }, [id]);

  const fetchProblemData = async () => {
    try {
      setLoading(true);
      const [problemRes, tutorialsRes, explanationsRes, visualizationsRes] =
        await Promise.all([
          problemsAPI.getProblem(id),
          problemsAPI.getVideoTutorials(id),
          problemsAPI.getSolutionExplanations(id),
          problemsAPI.getInteractiveVisualizations(id),
        ]);

      setProblem(problemRes.data);
      setTutorials(tutorialsRes.data);
      setExplanations(explanationsRes.data);
      setVisualizations(visualizationsRes.data);
    } catch (err) {
      setError("Failed to fetch learning resources");
      console.error("Error fetching learning resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Learning Resources
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tab icon={<PlayIcon />} label="Video Tutorials" />
          <Tab icon={<CodeIcon />} label="Solution Explanations" />
          <Tab icon={<TimelineIcon />} label="Interactive Visualizations" />
        </Tabs>

        {/* Video Tutorials Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {tutorials.map((tutorial) => (
                <Grid item xs={12} md={6} key={tutorial._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={tutorial.thumbnail}
                      alt={tutorial.title}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {tutorial.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph>
                        {tutorial.description}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <Chip
                          icon={<SchoolIcon />}
                          label={tutorial.difficulty}
                          size="small"
                        />
                        <Chip
                          icon={<TimelineIcon />}
                          label={`${tutorial.duration} min`}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        startIcon={<PlayIcon />}
                        onClick={() => setSelectedVideo(tutorial)}>
                        Watch Tutorial
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Solution Explanations Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <List>
              {explanations.map((explanation) => (
                <React.Fragment key={explanation._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <CodeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={explanation.title}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" paragraph>
                            {explanation.description}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Chip
                              icon={<PsychologyIcon />}
                              label={explanation.approach}
                              size="small"
                            />
                            <Chip
                              icon={<TimelineIcon />}
                              label={`Time Complexity: ${explanation.timeComplexity}`}
                              size="small"
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Interactive Visualizations Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {visualizations.map((visualization) => (
                <Grid item xs={12} md={6} key={visualization._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {visualization.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph>
                        {visualization.description}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <Chip
                          icon={<LightbulbIcon />}
                          label={visualization.type}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={() =>
                          navigate(`/visualizations/${visualization._id}`)
                        }>
                        Launch Visualization
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Video Player Dialog */}
      <Dialog
        open={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>{selectedVideo?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <video
              controls
              width="100%"
              src={selectedVideo?.videoUrl}
              poster={selectedVideo?.thumbnail}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedVideo(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LearningFeatures;
