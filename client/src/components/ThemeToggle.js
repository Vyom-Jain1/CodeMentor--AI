import React from "react";
import { IconButton, useTheme, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
  '&:hover': {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
  },
  margin: theme.spacing(1),
  position: "relative",
  zIndex: theme.zIndex.appBar + 1,
}));

const ThemeToggle = ({ mode, onToggle }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <StyledIconButton onClick={onToggle} size="large">
        {isDark ? <Brightness7 /> : <Brightness4 />}
      </StyledIconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
