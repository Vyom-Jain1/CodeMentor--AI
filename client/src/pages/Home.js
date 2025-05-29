import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
} from "@mui/material";
import { Code, School, Psychology, Speed } from "@mui/icons-material";

const features = [
  {
    title: "Interactive DSA Problems",
    description:
      "Practice with a curated collection of data structures and algorithms problems.",
    icon: <Code fontSize="large" />,
  },
  {
    title: "AI-Powered Learning",
    description:
      "Get personalized explanations and hints using advanced AI technology.",
    icon: <Psychology fontSize="large" />,
  },
  {
    title: "Structured Learning Path",
    description:
      "Follow a well-organized curriculum designed for optimal learning.",
    icon: <School fontSize="large" />,
  },
  {
    title: "Real-time Code Analysis",
    description:
      "Get instant feedback on your code's time and space complexity.",
    icon: <Speed fontSize="large" />,
  },
];

const Home = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          mt: 8,
          mb: 6,
          textAlign: "center",
        }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}>
          Welcome to CodeMentor
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your AI-powered companion for mastering Data Structures and Algorithms
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="large"
          aria-label="Get started with CodeMentor"
          sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 2,
              }}>
              <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to="/register"
                  size="small"
                  color="primary"
                  aria-label={`Learn more about ${feature.title}`}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 6,
          borderRadius: 2,
          textAlign: "center",
          mb: 8,
        }}>
        <Typography variant="h4" gutterBottom>
          Ready to Start Your DSA Journey?
        </Typography>
        <Typography variant="body1" paragraph>
          Join thousands of developers who are improving their problem-solving
          skills with CodeMentor.
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="large"
          aria-label="Sign up for CodeMentor"
          sx={{
            bgcolor: "white",
            color: "primary.main",
            "&:hover": {
              bgcolor: "grey.100",
            },
          }}>
          Sign Up Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
