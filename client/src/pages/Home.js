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
    <Container
      maxWidth="lg"
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "60vh",
        }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            mb: 2,
          }}>
          Welcome to CodeMentor
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: "800px",
            mb: 4,
            fontSize: { xs: "1.1rem", md: "1.5rem" },
          }}>
          Your AI-powered companion for mastering Data Structures and Algorithms
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="large"
          aria-label="Get started with CodeMentor"
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
          }}>
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
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
          mb: 4,
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
