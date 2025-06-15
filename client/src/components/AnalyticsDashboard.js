import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { problemsAPI } from "../services/api";

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState({
    overallStats: {
      totalProblems: 0,
      solvedProblems: 0,
      successRate: 0,
      averageTime: 0,
    },
    categoryStats: [],
    difficultyStats: [],
    recentActivity: [],
    performanceTrend: [],
    strengths: [],
    weaknesses: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await problemsAPI.getUserAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError("Failed to fetch analytics data");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Performance Analytics
      </Typography>

      {/* Overall Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Problems
              </Typography>
              <Typography variant="h4">
                {analytics.overallStats.totalProblems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Solved Problems
              </Typography>
              <Typography variant="h4">
                {analytics.overallStats.solvedProblems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">
                {analytics.overallStats.successRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Time
              </Typography>
              <Typography variant="h4">
                {analytics.overallStats.averageTime} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="solved" fill="#8884d8" name="Solved" />
                <Bar dataKey="attempted" fill="#82ca9d" name="Attempted" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="problems"
                  stroke="#8884d8"
                  name="Problems Solved"
                />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#82ca9d"
                  name="Success Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Strengths and Weaknesses */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Strengths
            </Typography>
            <List>
              {analytics.strengths.map((strength, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={strength.category}
                    secondary={`Success Rate: ${strength.successRate}%`}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={strength.successRate}
                    sx={{ width: 100 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Areas for Improvement
            </Typography>
            <List>
              {analytics.weaknesses.map((weakness, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={weakness.category}
                    secondary={`Success Rate: ${weakness.successRate}%`}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      /* Navigate to practice problems */
                    }}>
                    Practice
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Timeline>
          {analytics.recentActivity.map((activity, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  color={activity.status === "success" ? "success" : "error"}
                />
                {index < analytics.recentActivity.length - 1 && (
                  <TimelineConnector />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">
                  {activity.problemTitle}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {activity.timestamp} -{" "}
                  {activity.status === "success" ? "Solved" : "Attempted"}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={activity.category} size="small" sx={{ mr: 1 }} />
                  <Chip
                    label={activity.difficulty}
                    size="small"
                    color={
                      activity.difficulty === "easy"
                        ? "success"
                        : activity.difficulty === "medium"
                        ? "warning"
                        : "error"
                    }
                  />
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    </Box>
  );
};

export default AnalyticsDashboard;
