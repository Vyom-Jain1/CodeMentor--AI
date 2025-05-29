import React, { useState } from "react";
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({
  onSearch,
  placeholder = "Search...",
  loading = false,
  fullWidth = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: fullWidth ? "100%" : 400,
      }}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        id="search-input"
        aria-label={placeholder}
      />
      {searchTerm && (
        <IconButton sx={{ p: "10px" }} aria-label="clear" onClick={handleClear}>
          <ClearIcon />
        </IconButton>
      )}
      <IconButton
        type="submit"
        sx={{ p: "10px" }}
        aria-label="search"
        disabled={loading}>
        {loading ? <CircularProgress size={24} /> : <SearchIcon />}
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
