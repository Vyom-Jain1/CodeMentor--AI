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
} from "@mui/material";
import {
  Architecture,
  Storage,
  Cloud,
  Security,
  Speed,
  Scale,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const SystemDesign = () => {
  const topics = [
    {
      title: "Basic Concepts",
      icon: <Architecture />,
      items: [
        "System Design Fundamentals",
        "Scalability",
        "High Availability",
        "Load Balancing",
        "Caching Strategies",
      ],
    },
    {
      title: "Database Design",
      icon: <Storage />,
      items: [
        "Database Types",
        "Data Modeling",
        "Sharding",
        "Replication",
        "Consistency Patterns",
      ],
    },
    {
      title: "Cloud Architecture",
      icon: <Cloud />,
      items: [
        "Cloud Services",
        "Microservices",
        "Serverless Architecture",
        "Containerization",
        "Service Mesh",
      ],
    },
    {
      title: "Security",
      icon: <Security />,
      items: [
        "Authentication & Authorization",
        "Data Encryption",
        "API Security",
        "Network Security",
        "Compliance",
      ],
    },
    {
      title: "Performance",
      icon: <Speed />,
      items: [
        "Performance Optimization",
        "Caching Strategies",
        "CDN Implementation",
        "Database Optimization",
        "Load Testing",
      ],
    },
    {
      title: "Scalability",
      icon: <Scale />,
      items: [
        "Horizontal Scaling",
        "Vertical Scaling",
        "Database Scaling",
        "Caching at Scale",
        "Message Queues",
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Design
      </Typography>
      <Typography variant="body1" paragraph>
        Learn how to design scalable, reliable, and efficient systems. Master
        the concepts and best practices of system design.
      </Typography>

      <Grid container spacing={3}>
        {topics.map((topic, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {topic.icon}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {topic.title}
                </Typography>
              </Box>
              <List>
                {topic.items.map((item, itemIndex) => (
                  <React.Fragment key={itemIndex}>
                    <ListItem>
                      <ListItemText primary={item} />
                    </ListItem>
                    {itemIndex < topic.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/learning/system-design/${topic.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}>
                  Learn More
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SystemDesign;
