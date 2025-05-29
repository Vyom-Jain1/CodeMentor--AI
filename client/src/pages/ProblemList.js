import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  LinearProgress,
  Alert,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { problemsAPI } from "../services/api";

const INITIAL_CATEGORIES = [
  {
    title: "Arrays",
    description: "Learn Array Data Structure",
    topics: [
      {
        title: "Easy",
        problems: [],
      },
      {
        title: "Medium",
        problems: [],
      },
      {
        title: "Hard",
        problems: [],
      },
    ],
  },
  {
    title: "Strings",
    description: "Learn String Data Structure",
    topics: [
      {
        title: "Basic",
        problems: [],
      },
      {
        title: "Pattern Matching",
        problems: [],
      },
    ],
  },
  {
    title: "Linked Lists",
    description: "Learn Linked List Data Structure",
    topics: [
      {
        title: "Singly Linked List",
        problems: [],
      },
      {
        title: "Doubly Linked List",
        problems: [],
      },
    ],
  },
  {
    title: "Stacks & Queues",
    description: "Stack and queue data structures and their applications",
    problems: [],
  },
  {
    title: "Trees",
    description: "Binary trees, BST, and tree traversal algorithms",
    problems: [],
  },
  {
    title: "Graphs",
    description: "Graph algorithms and traversal techniques",
    problems: [],
  },
  {
    title: "Dynamic Programming",
    description: "DP patterns and optimization problems",
    problems: [],
  },
  {
    title: "Greedy",
    description: "Greedy algorithms and optimization",
    problems: [],
  },
];

const ProblemList = () => {
  const [categoriesState, setCategoriesState] = useState(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await problemsAPI.getAllProblems();
      const problemsData = response.data.data || [];

      // Categorize problems by difficulty and topic
      const categorizedProblems = INITIAL_CATEGORIES.map((category) => {
        const categoryProblems = problemsData.filter(
          (problem) => problem.category === category.title
        );

        // Handle categories with topics
        if (category.topics && Array.isArray(category.topics)) {
          const updatedTopics = category.topics.map((topic) => ({
            ...topic,
            problems: categoryProblems.filter(
              (problem) =>
                problem.difficulty.toLowerCase() ===
                  topic.title.toLowerCase() || problem.topic === topic.title
            ),
          }));

          return {
            ...category,
            topics: updatedTopics,
          };
        }

        // Handle categories without topics
        return {
          ...category,
          problems: categoryProblems,
        };
      });

      setCategoriesState(categorizedProblems);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError("Failed to fetch problems. Please try again later.");
      setLoading(false);
    }
  };

  const getTopicProgress = (problems) => {
    const solved = problems.filter((p) => p.status === "solved").length;
    return (solved / problems.length) * 100 || 0;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}>
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700, mb: 4 }}>
        DSA Problem Sheet
      </Typography>

      <Grid container spacing={3}>
        {categoriesState.map((category, index) => (
          <Grid item xs={12} key={index}>
            <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
              <Box sx={{ p: 3, bgcolor: "background.paper" }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  {category.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}>
                  {category.description}
                </Typography>

                {category.topics ? (
                  // Render topics if they exist
                  category.topics.map((topic, topicIndex) => (
                    <Box key={topicIndex} sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                        {topic.title}
                      </Typography>
                      <List>
                        {topic.problems.map((problem, problemIndex) => (
                          <React.Fragment key={problemIndex}>
                            <ListItem
                              button
                              onClick={() =>
                                navigate(`/problems/${problem._id}`)
                              }
                              sx={{
                                borderRadius: 1,
                                "&:hover": { bgcolor: "action.hover" },
                              }}>
                              <ListItemIcon>
                                {problem.status === "solved" ? (
                                  <CheckCircleIcon color="success" />
                                ) : (
                                  <RadioButtonUncheckedIcon />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={problem.title}
                                secondary={`Difficulty: ${problem.difficulty}`}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PlayArrowIcon />}
                                size="small">
                                Solve
                              </Button>
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))}
                      </List>
                    </Box>
                  ))
                ) : (
                  // Render problems directly if no topics
                  <List>
                    {category.problems.map((problem, problemIndex) => (
                      <React.Fragment key={problemIndex}>
                        <ListItem
                          button
                          onClick={() => navigate(`/problems/${problem._id}`)}
                          sx={{
                            borderRadius: 1,
                            "&:hover": { bgcolor: "action.hover" },
                          }}>
                          <ListItemIcon>
                            {problem.status === "solved" ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <RadioButtonUncheckedIcon />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={problem.title}
                            secondary={`Difficulty: ${problem.difficulty}`}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PlayArrowIcon />}
                            size="small">
                            Solve
                          </Button>
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProblemList;
