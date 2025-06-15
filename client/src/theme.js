import { createTheme } from "@mui/material/styles";

const commonComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollBehavior: "smooth",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(0,0,0,0.05)",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,0.15)",
          borderRadius: "8px",
          "&:hover": {
            background: "rgba(0,0,0,0.25)",
          },
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
        borderRadius: 12,
        backgroundImage: "none",
        "&.glass": {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 12,
        fontWeight: 600,
        padding: "12px 24px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "translateX(-100%)",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          "&::before": {
            transform: "translateX(100%)",
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        "&:active": {
          transform: "translateY(1px)",
        },
      },
      contained: {
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        "&:hover": {
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        transition: "all 0.2s ease-in-out",
        "&.glass": {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 12,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "& fieldset": {
            borderColor: "rgba(0,0,0,0.12)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(0,0,0,0.24)",
          },
          "&.Mui-focused": {
            transform: "translateY(-2px)",
            "& fieldset": {
              borderWidth: "2px",
            },
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1E40AF",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#059669",
      light: "#34D399",
      dark: "#047857",
      contrastText: "#ffffff",
    },
    success: {
      main: "#059669",
      light: "#34D399",
      dark: "#047857",
    },
    info: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1E40AF",
    },
    warning: {
      main: "#D97706",
      light: "#FBBF24",
      dark: "#B45309",
    },
    error: {
      main: "#DC2626",
      light: "#F87171",
      dark: "#B91C1C",
    },
    background: {
      default: "#F8FAFC",
      paper: "#ffffff",
      dark: "#0F172A",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      disabled: "#94A3B8",
    },
    divider: "rgba(0, 0, 0, 0.06)",
    action: {
      active: "#6B7280",
      hover: "rgba(59, 130, 246, 0.04)",
      selected: "rgba(59, 130, 246, 0.08)",
      disabled: "#E5E7EB",
      disabledBackground: "#F3F4F6",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: commonComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#60A5FA",
      light: "#93C5FD",
      dark: "#3B82F6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9CA3AF",
      light: "#D1D5DB",
      dark: "#6B7280",
    },
    background: {
      default: "#121212",
      paper: "#1a1a1a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#888888",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "2.5rem",
      letterSpacing: "-0.025em",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.025em",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.75rem",
      letterSpacing: "-0.025em",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "-0.025em",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      letterSpacing: "-0.025em",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      letterSpacing: "-0.025em",
      lineHeight: 1.4,
    },
    subtitle1: { fontSize: "1rem", lineHeight: 1.5, fontWeight: 500 },
    subtitle2: { fontSize: "0.875rem", lineHeight: 1.5, fontWeight: 500 },
    body1: { fontSize: "0.875rem", lineHeight: 1.6 },
    body2: { fontSize: "0.75rem", lineHeight: 1.6 },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.025em",
    },
    caption: { fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 400 },
    overline: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
      fontWeight: 600,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
  },
});
