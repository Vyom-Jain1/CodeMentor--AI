import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button,
} from "@mui/material";
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  Speed,
  EmojiEvents,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { problemsAPI } from "../services/api";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    successRate: 0,
    recentActivity: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch problems to calculate stats
      const { data } = await problemsAPI.getAllProblems();
      
      if (data.success) {
        const totalProblems = data.total || data.data.length;
        const solvedProblems = user?.progress?.completedProblems?.length || 0;
        const successRate = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;
        
        setStats({
          totalProblems,
          solvedProblems,
          successRate,
          recentActivity: [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Please log in to view your dashboard
        </Typography>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Container>
    );
  }

  const StatCard = ({ title, value, icon, color = "primary", subtitle }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: `${color}.light`,
              color: `${color}.contrastText`,
              mr: 2,
            }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Welcome back, {user.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your coding progress overview
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Problems Solved"
            value={stats.solvedProblems}
            icon={<CheckCircle />}
            color="success"
            subtitle={`out of ${stats.totalProblems} total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={<TrendingUp />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Streak"
            value={user.progress?.streak?.daily || 0}
            icon={<Speed />}
            color="warning"
            subtitle="days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Points"
            value={user.progress?.points || 0}
            icon={<EmojiEvents />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Progress Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Progress
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Overall Progress</Typography>
                <Typography variant="body2">{stats.successRate}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.successRate}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                label={`Easy: ${user.progress?.completedProblems?.filter(p => p.difficulty === 'easy')?.length || 0}`}
                color="success"
                variant="outlined"
              />
              <Chip
                label={`Medium: ${user.progress?.completedProblems?.filter(p => p.difficulty === 'medium')?.length || 0}`}
                color="warning"
                variant="outlined"
              />
              <Chip
                label={`Hard: ${user.progress?.completedProblems?.filter(p => p.difficulty === 'hard')?.length || 0}`}
                color="error"
                variant="outlined"
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/problems")}
                startIcon={<Assignment />}>
                Browse Problems
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/learning-path")}>
                Learning Path
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/profile")}>
                View Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        {stats.recentActivity.length > 0 ? (
          <Box>
            {stats.recentActivity.map((activity, index) => (
              <Box key={index} sx={{ py: 1 }}>
                <Typography variant="body2">{activity}</Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No recent activity. Start solving problems to see your progress here!
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;