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
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Business,
  Code,
  School,
  Timer,
  TrendingUp,
  Work,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const InterviewPrep = () => {
  const companies = [
    {
      name: "Google",
      icon: <Business />,
      problems: [
        { id: 1, title: "LRU Cache", difficulty: "Hard" },
        { id: 2, title: "Design Tic-tac-toe", difficulty: "Medium" },
        { id: 3, title: "Word Ladder", difficulty: "Hard" },
      ],
    },
    {
      name: "Amazon",
      icon: <Business />,
      problems: [
        { id: 4, title: "Design Parking Lot", difficulty: "Medium" },
        { id: 5, title: "Design Rate Limiter", difficulty: "Hard" },
        { id: 6, title: "Design TinyURL", difficulty: "Medium" },
      ],
    },
    {
      name: "Microsoft",
      icon: <Business />,
      problems: [
        { id: 7, title: "Design Excel", difficulty: "Hard" },
        { id: 8, title: "Design Snake Game", difficulty: "Medium" },
        { id: 9, title: "Design Twitter", difficulty: "Hard" },
      ],
    },
  ];

  const resources = [
    {
      title: "Mock Interviews",
      description: "Practice with AI-powered mock interviews",
      icon: <Timer />,
      route: "/learning/interview/mock",
    },
    {
      title: "Company-specific Prep",
      description: "Prepare for specific companies",
      icon: <Business />,
      route: "/learning/interview/companies",
    },
    {
      title: "System Design",
      description: "Master system design interviews",
      icon: <Code />,
      route: "/learning/system-design",
    },
    {
      title: "Behavioral Questions",
      description: "Practice behavioral interviews",
      icon: <Work />,
      route: "/learning/interview/behavioral",
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
        Interview Preparation
      </Typography>
      <Typography variant="body1" paragraph>
        Prepare for technical interviews with our comprehensive resources and
        practice problems.
      </Typography>

      {/* Resources Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {resources.map((resource, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {resource.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {resource.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {resource.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  to={resource.route}>
                  Start Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Company-specific Problems */}
      <Typography variant="h5" gutterBottom>
        Company-specific Problems
      </Typography>
      <Grid container spacing={3}>
        {companies.map((company, index) => (
          <Grid item xs={12} key={index}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {company.icon}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {company.name}
                </Typography>
              </Box>
              <List>
                {company.problems.map((problem, problemIndex) => (
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
                    {problemIndex < company.problems.length - 1 && <Divider />}
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

export default InterviewPrep;
