import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Button,
  Alert,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
<<<<<<< HEAD
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
=======
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PlayArrow as PlayArrowIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
<<<<<<< HEAD
  Sort as SortIcon,
=======
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
} from "@mui/icons-material";
import { problemsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProblemList = () => {
<<<<<<< HEAD
  const [categoriesState, setCategoriesState] = useState(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [anchorEl, setAnchorEl] = useState(null);
=======
  const { user } = useAuth();
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "",
    category: "",
    search: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProblems();
    fetchCategories();
  }, []);

<<<<<<< HEAD
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filterAndSortProblems = (problems) => {
    return problems
      .filter((problem) => {
        const matchesSearch = problem.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesDifficulty =
          selectedDifficulty === "all" ||
          problem.difficulty.toLowerCase() === selectedDifficulty;
        return matchesSearch && matchesDifficulty;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "difficulty":
            return a.difficulty.localeCompare(b.difficulty);
          case "submissions":
            return b.submissions - a.submissions;
          default:
            return 0;
        }
      });
  };
=======
  useEffect(() => {
    applyFilters();
  }, [problems, filters]);
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await problemsAPI.getAllProblems();
      
      if (data.success) {
        setProblems(data.data || []);
      } else {
        setError("Failed to fetch problems");
      }
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError("Failed to fetch problems. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await problemsAPI.getCategories();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const applyFilters = () => {
    let filtered = [...problems];

    if (filters.difficulty) {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty);
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProblems(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const isProblemSolved = (problemId) => {
    return user?.progress?.completedProblems?.some(p => 
      typeof p === 'string' ? p === problemId : p._id === problemId
    ) || false;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
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
        <Button 
          variant="contained" 
          onClick={fetchProblems} 
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
<<<<<<< HEAD
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          DSA Problem Sheet
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              displayEmpty
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              displayEmpty
            >
              <MenuItem value="title">Sort by Title</MenuItem>
              <MenuItem value="difficulty">Sort by Difficulty</MenuItem>
              <MenuItem value="submissions">Sort by Submissions</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

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
                            py: 2,
                          }}>
                          <ListItemIcon>
                            {problem.status === "solved" ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <RadioButtonUncheckedIcon />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primaryTypographyProps={{ component: 'div' }}
                            secondaryTypographyProps={{ component: 'div' }}
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body1">{problem.title}</Typography>
                                <Chip
                                  label={problem.difficulty}
                                  size="small"
                                  color={
                                    problem.difficulty === "easy"
                                      ? "success"
                                      : problem.difficulty === "medium"
                                      ? "warning"
                                      : "error"
                                  }
                                  sx={{ textTransform: "capitalize" }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {`Success Rate: ${problem.successRate || 0}%`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {`Submissions: ${problem.submissions || 0}`}
                                </Typography>
                                {problem.tags && problem.tags.length > 0 && (
                                  <Box sx={{ display: "flex", gap: 0.5 }}>
                                    {problem.tags.map((tag, tagIndex) => (
                                      <Chip
                                        key={tagIndex}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 20 }}
                                      />
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            }
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
=======
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700, mb: 4 }}>
        DSA Problem Collection
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Search problems..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filters.difficulty}
                label="Difficulty"
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <MenuItem value="">All Difficulties</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setFilters({ difficulty: "", category: "", search: "" })}
              sx={{ height: "56px" }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Problems List */}
      <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
        <Box sx={{ p: 3, bgcolor: "background.paper" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Problems ({filteredProblems.length})
          </Typography>
          
          {filteredProblems.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No problems found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredProblems.map((problem, index) => (
                <React.Fragment key={problem._id}>
                  <ListItem
                    sx={{
                      borderRadius: 1,
                      "&:hover": { bgcolor: "action.hover" },
                      py: 2,
                    }}>
                    <ListItemIcon>
                      {isProblemSolved(problem._id) ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="h6" component="span">
                            {problem.title}
                          </Typography>
                          <Chip
                            label={problem.difficulty}
                            color={getDifficultyColor(problem.difficulty)}
                            size="small"
                          />
                          <Chip
                            label={problem.category}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {problem.description?.substring(0, 150)}
                          {problem.description?.length > 150 ? "..." : ""}
                        </Typography>
                      }
                    />
                    
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => navigate(`/problems/${problem._id}`)}
                      sx={{ ml: 2 }}
                    >
                      {isProblemSolved(problem._id) ? "Review" : "Solve"}
                    </Button>
                  </ListItem>
                  
                  {index < filteredProblems.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProblemList;