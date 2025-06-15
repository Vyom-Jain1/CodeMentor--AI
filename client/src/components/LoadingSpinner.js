import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  styled,
  keyframes,
} from "@mui/material";

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "200px",
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  borderRadius: 20,
  background:
    theme.palette.mode === "dark"
      ? "rgba(17, 25, 40, 0.75)"
      : "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(12px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#60A5FA" : "#2563EB",
  animation: `${rotate} 1.5s linear infinite`,
  "& .MuiCircularProgress-svg": {
    filter: "drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))",
  },
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  textAlign: "center",
  textShadow:
    theme.palette.mode === "dark"
      ? "0 0 10px rgba(255, 255, 255, 0.2)"
      : "0 0 10px rgba(0, 0, 0, 0.1)",
}));

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <LoadingContainer>
      <StyledCircularProgress size={50} thickness={4} />
      <LoadingText variant="h6">{message}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
