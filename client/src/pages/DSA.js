import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from "@mui/material";
import { Code, CheckCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";

const DSA = () => {
  const topics = [
    {
      title: "Arrays and Strings",
      problems: [
        { id: 1, title: "Two Sum", difficulty: "Easy" },
        {
          id: 2,
          title: "Longest Substring Without Repeating Characters",
          difficulty: "Medium",
        },
        { id: 3, title: "Merge K Sorted Lists", difficulty: "Hard" },
      ],
    },
    {
      title: "Linked Lists",
      problems: [
        { id: 4, title: "Reverse Linked List", difficulty: "Easy" },
        { id: 5, title: "Merge Two Sorted Lists", difficulty: "Easy" },
        { id: 6, title: "LRU Cache", difficulty: "Hard" },
      ],
    },
    {
      title: "Trees and Graphs",
      problems: [
        {
          id: 7,
          title: "Binary Tree Level Order Traversal",
          difficulty: "Medium",
        },
        { id: 8, title: "Validate Binary Search Tree", difficulty: "Medium" },
        { id: 9, title: "Word Ladder", difficulty: "Hard" },
      ],
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Data Structures and Algorithms
      </Typography>
      <Typography variant="body1" paragraph>
        Master the fundamentals of data structures and algorithms with our
        curated collection of problems.
      </Typography>

      <Grid container spacing={3}>
        {topics.map((topic, index) => (
          <Grid item xs={12} key={index}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {topic.title}
              </Typography>
              <List>
                {topic.problems.map((problem, problemIndex) => (
                  <React.Fragment key={problem.id}>
                    <ListItem
                      button
                      component={Link}
                      to={`/problems/${problem.id}`}
                      sx={{
                        borderRadius: 1,
                        "&:hover": { bgcolor: "action.hover" },
                      }}>
                      <ListItemIcon>
                        <Code />
                      </ListItemIcon>
                      <ListItemText
                        primary={problem.title}
                        secondary={
                          <Box
                            component="div"
                            sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                            <Chip
                              label={problem.difficulty}
                              size="small"
                              color={getDifficultyColor(problem.difficulty)}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {problemIndex < topic.problems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DSA;
