import React, { useState } from "react";
<<<<<<< HEAD
import { useThemeContext } from "../theme/ThemeProvider";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
=======
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
<<<<<<< HEAD
  Badge,
  Avatar,
  Tooltip,
  useMediaQuery,
  Container,
  styled,
  alpha,
=======
  Avatar,
  Menu,
  MenuItem,
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  SmartToy as SmartToyIcon,
<<<<<<< HEAD
  Code as CodeIcon,
  School as SchoolIcon,
  Forum as ForumIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Dashboard as DashboardIcon,
=======
  Home as HomeIcon,
  Assignment as AssignmentIcon,
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
} from "@mui/icons-material";
import { keyframes } from "@mui/system";
import ThemeToggle from "./ThemeToggle";

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: theme.spacing(8),
  zIndex: theme.zIndex.appBar,
  backdropFilter: "blur(20px)",
  borderBottom: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  boxShadow: "none",
  transition: "all 0.3s ease",
  display: "flex",
  justifyContent: "center",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0, 3),
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  color: theme.palette.text.primary,
  "&:hover": {
    transform: "translateY(-2px)",
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  "&.active": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: `2px solid ${theme.palette.primary.main}`,
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
}));

const menuItems = [
  { title: "Problems", icon: <CodeIcon />, path: "/problems" },
  { title: "Learn", icon: <SchoolIcon />, path: "/learning" },
  { title: "Discuss", icon: <ForumIcon />, path: "/discussions" },
  {
    title: "Interview Prep",
    icon: <AssessmentIcon />,
    path: "/learning/interview",
  },
];

const Navbar = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const { toggleColorMode } = useThemeContext();
=======
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
  const theme = useTheme();

  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // State for user menu
  const [anchorElUser, setAnchorElUser] = useState(null);

  // State for notifications menu
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

<<<<<<< HEAD
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNavMenu = () => {
    setMobileOpen(false);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <StyledAppBar
        position="fixed"
        elevation={0}
        sx={{
          animation: `${slideIn} 0.5s ease-out`,
          background:
            theme.palette.mode === "dark"
              ? "rgba(17, 25, 40, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
        }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo for desktop */}
            <LogoContainer
              sx={{ display: { xs: "none", md: "flex" } }}
              onClick={() => navigate("/")}>
              <CodeIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #2563EB, #059669)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                CodeMentor AI
              </Typography>
            </LogoContainer>

            {/* Mobile menu */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                onClick={handleDrawerToggle}
                color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo for mobile */}
            <LogoContainer
              sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}
              onClick={() => navigate("/")}>
              <CodeIcon sx={{ fontSize: 28, color: "primary.main" }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #2563EB, #059669)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                CodeMentor AI
              </Typography>
            </LogoContainer>

            {/* Desktop menu */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                ml: 4,
                gap: 1,
              }}>
              {menuItems.map((item) => (
                <NavButton
                  key={item.title}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(item.path);
                  }}
                  startIcon={item.icon}>
                  {item.title}
                </NavButton>
              ))}
            </Box>

            {/* User menu */}
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}>
              <ThemeToggle
                mode={theme.palette.mode}
                onToggle={toggleColorMode}
              />
              {currentUser ? (
                <>
                  <Tooltip title="Open settings" arrow>
                    <StyledAvatar
                      onClick={handleOpenUserMenu}
                      alt={currentUser?.name || "User"}
                      src={currentUser?.avatar}>
                      {!currentUser?.avatar && (currentUser?.name?.[0] || "U")}
                    </StyledAvatar>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}>
                    <MenuItem onClick={() => navigate("/dashboard")}>
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Dashboard</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/settings")}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Settings</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <NavButton
                  variant="contained"
                  onClick={() => navigate("/login")}
                  startIcon={<AccountIcon />}>
                  Sign In
                </NavButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        onClick={handleNotificationsClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: "80vh",
            overflow: "auto",
          },
        }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" color="text.primary">
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have 3 new notifications
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem>
            <ListItemText
              primary="New Achievement Unlocked!"
              secondary="You've completed your first challenge"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Code Review Available"
              secondary="Your recent submission has been reviewed"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Learning Milestone"
              secondary="You're making great progress!"
            />
          </ListItem>
        </List>
      </Menu>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            background:
              theme.palette.mode === "dark"
                ? "rgba(17, 25, 40, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        }}>
        <Box sx={{ p: 2 }}>
          <LogoContainer onClick={() => navigate("/")}>
            <CodeIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #2563EB, #059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              CodeMentor AI
            </Typography>
          </LogoContainer>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
=======
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
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
            <ListItem
              key={item.title}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "action.hover",
                  transform: "translateX(4px)",
                },
              }}>
              <ListItemIcon sx={{ color: "primary.main" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: 600,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

<<<<<<< HEAD
      {/* Main content spacing */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }} />
    </Box>
=======
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
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
  );
};

export default Navbar;