<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
<<<<<<< HEAD
  LinearProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from "@mui/material";
import {
  Timeline,
  Code,
  School,
  CheckCircle,
  Star,
  TrendingUp,
  Assignment,
  PlayArrow,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const LEARNING_PATHS = [
  {
    title: "DSA Sheet",
    description: "Curated list of Data Structures and Algorithms problems",
    totalProblems: 450,
    completed: 0,
    route: "/dsa",
    icon: <Timeline />,
  },
  {
    title: "System Design",
    description: "Learn how to design scalable systems",
    totalProblems: 60,
    completed: 0,
    route: "/system-design",
    icon: <Code />,
  },
  {
    title: "Interview Preparation",
    description: "Most asked coding interview questions",
    totalProblems: 200,
    completed: 0,
    route: "/interview-prep",
    icon: <School />,
  },
];

const FEATURED_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    solved: false,
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    solved: false,
  },
  {
    id: 3,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    category: "Linked Lists",
    solved: false,
  },
];

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: "20px 0" }}>
    {value === index && children}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
=======
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
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813

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

<<<<<<< HEAD
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
      {/* Welcome Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrow />}
          component={Link}
          to="/problems"
          sx={{ borderRadius: 2 }}>
          Start Coding
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: "primary.light", color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Assignment sx={{ mr: 1 }} />
              <Typography variant="h6">Problems Solved</Typography>
            </Box>
            <Typography variant="h4">{user.stats?.totalSolved || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: "success.light", color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="h6">Success Rate</Typography>
            </Box>
            <Typography variant="h4">
              {Math.round(
                ((user.stats?.correctSubmissions || 0) /
                  (user.stats?.totalSubmissions || 1)) *
                  100
              )}
              %
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: "warning.light", color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Star sx={{ mr: 1 }} />
              <Typography variant="h6">Current Streak</Typography>
            </Box>
            <Typography variant="h4">{user.stats?.streak || 0} days</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: "error.light", color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h6">Ranking</Typography>
            </Box>
            <Typography variant="h4">#{user.stats?.rank || "N/A"}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tab label="Learning Paths" />
              <Tab label="Featured Problems" />
              <Tab label="Your Solutions" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {LEARNING_PATHS.map((path, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          {path.icon}
                          <Typography variant="h6" sx={{ ml: 2 }}>
                            {path.title}
                          </Typography>
                        </Box>
                        <Typography color="textSecondary" paragraph>
                          {path.description}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body2" color="textSecondary">
                            Progress: {path.completed}/{path.totalProblems}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(path.completed / path.totalProblems) * 100}
                            sx={{ flexGrow: 1, mx: 2 }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {Math.round(
                              (path.completed / path.totalProblems) * 100
                            )}
                            %
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={Link}
                          to={path.route}
                          size="small"
                          color="primary">
                          Continue Learning
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <List>
                {FEATURED_PROBLEMS.map((problem, index) => (
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
                        {problem.solved ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Assignment />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ component: 'span' }} // Added this line
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
                            <Chip
                              label={problem.category}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }} // Added this line
                      />
                    </ListItem>
                    {index < FEATURED_PROBLEMS.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1" color="textSecondary" align="center">
                Your recent solutions will appear here
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Coding Streak
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
              }}>
              <CircularProgress
                variant="determinate"
                value={Math.min(((user.stats?.streak || 0) / 30) * 100, 100)}
                size={120}
                thickness={4}
                sx={{ position: "relative" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}>
                <Typography variant="h4" component="div">
                  {user.stats?.streak || 0}
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary">
                  days
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <List>
              <ListItem button component={Link} to="/learning/dsa">
                <ListItemIcon>
                  <Timeline />
                </ListItemIcon>
                <ListItemText primary="DSA Sheet" />
              </ListItem>
              <ListItem button component={Link} to="/problems">
                <ListItemIcon>
                  <Code />
                </ListItemIcon>
                <ListItemText primary="Practice Problems" />
              </ListItem>
              <ListItem button component={Link} to="/learning/system-design">
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary="System Design" />
              </ListItem>
            </List>
=======
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
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
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