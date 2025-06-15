import React, { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
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
  Avatar,
  Menu,
  MenuItem,
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
  Home as HomeIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = isAuthenticated
    ? [
        { text: "Home", icon: <HomeIcon />, path: "/" },
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "Problems", icon: <CodeIcon />, path: "/problems" },
        { text: "Learning Path", icon: <SchoolIcon />, path: "/learning-path" },
        {
          text: "Code Editor Test",
          icon: <SmartToyIcon />,
          path: "/code-editor-test",
        },
      ]
    : [
        { text: "Home", icon: <HomeIcon />, path: "/" },
        { text: "Login", icon: <LoginIcon />, path: "/login" },
        { text: "Register", icon: <AssignmentIcon />, path: "/register" },
        {
          text: "Code Editor Test",
          icon: <SmartToyIcon />,
          path: "/code-editor-test",
        },
      ];

  const isActivePath = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          CodeMaster
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
            selected={isActivePath(item.path)}
            sx={{
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main + "20",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main + "30",
                },
              },
            }}>
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isAuthenticated && (
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
              ? "rgba(18, 18, 18, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
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
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: theme.palette.text.primary,
                    backgroundColor: isActivePath(item.path) 
                      ? theme.palette.primary.main + "20" 
                      : "transparent",
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
              
              {isAuthenticated && user && (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        fontSize: "0.875rem",
                      }}>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                  </IconButton>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    onClick={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                    <MenuItem onClick={() => navigate('/profile')}>
                      <PersonIcon sx={{ mr: 1 }} />
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
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