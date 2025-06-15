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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PlayArrow as PlayArrowIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { problemsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProblemList = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    applyFilters();
  }, [problems, filters]);

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