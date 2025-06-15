import React from "react";
import { Box, Container, styled, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(to bottom right, #0F172A, #1E293B)"
      : "linear-gradient(to bottom right, #F8FAFC, #F1F5F9)",
  position: "relative",
  overflowX: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 50% 0%, ${
      theme.palette.mode === "dark"
        ? "rgba(37, 99, 235, 0.15)"
        : "rgba(37, 99, 235, 0.1)"
    } 0%, transparent 50%)`,
    pointerEvents: "none",
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(4),
  position: "relative",
  zIndex: 1,
  minHeight: `calc(100vh - ${theme.spacing(8)})`,
  display: "flex",
  flexDirection: "column",
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "10%",
    width: "30%",
    height: "40%",
    background: `radial-gradient(circle, ${
      theme.palette.mode === "dark"
        ? "rgba(5, 150, 105, 0.15)"
        : "rgba(5, 150, 105, 0.1)"
    } 0%, transparent 70%)`,
    transform: "translateY(-50%)",
    filter: "blur(60px)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "20%",
    right: "10%",
    width: "25%",
    height: "35%",
    background: `radial-gradient(circle, ${
      theme.palette.mode === "dark"
        ? "rgba(37, 99, 235, 0.15)"
        : "rgba(37, 99, 235, 0.1)"
    } 0%, transparent 70%)`,
    filter: "blur(60px)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
}));

const Layout = () => {
  const theme = useTheme();

  return (
    <PageWrapper>
      <Navbar />
      <MainContent>
        <StyledContainer maxWidth="xl">
          <Outlet />
        </StyledContainer>
      </MainContent>
    </PageWrapper>
  );
};

export default Layout;
