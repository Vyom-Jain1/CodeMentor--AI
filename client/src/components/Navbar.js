import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Code as CodeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Dashboard as DashboardIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = user
    ? [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "Problems", icon: <CodeIcon />, path: "/problems" },
        { text: "Profile", icon: <PersonIcon />, path: "/profile" },
        {
          text: "Code Editor Test",
          icon: <SmartToyIcon />,
          path: "/code-editor-test",
        },
      ]
    : [
        { text: "Login", icon: <LoginIcon />, path: "/login" },
        { text: "Register", icon: <SchoolIcon />, path: "/register" },
        {
          text: "Code Editor Test",
          icon: <SmartToyIcon />,
          path: "/code-editor-test",
        },
      ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
              },
            }}>
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {user && (
          <>
            <Divider />
            <ListItem
              button
              onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}
              sx={{
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}>
              <ListItemIcon sx={{ color: theme.palette.error.main }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "none",
          borderBottom: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(0, 0, 0, 0.12)"
          }`,
        }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: theme.palette.text.primary,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
            }}>
            <CodeIcon sx={{ color: theme.palette.primary.main }} />
            CodeMaster
          </Typography>
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.04)",
                    },
                  }}>
                  {item.text}
                </Button>
              ))}
              {user && (
                <Button
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    color: theme.palette.error.main,
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.04)",
                    },
                  }}>
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
              backgroundColor: theme.palette.background.paper,
            },
          }}>
          {drawer}
        </Drawer>
      </Box>
      <Toolbar />
    </>
  );
};

export default Navbar;
