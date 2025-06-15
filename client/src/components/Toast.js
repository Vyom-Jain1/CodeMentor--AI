import React from "react";
import { Snackbar, Alert, styled, Slide } from "@mui/material";
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  WarningAmberOutlined as WarningIcon,
} from "@mui/icons-material";

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  "& .MuiSnackbarContent-root": {
    minWidth: "300px",
    borderRadius: 16,
    backdropFilter: "blur(8px)",
    background:
      theme.palette.mode === "dark"
        ? "rgba(17, 25, 40, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"
    }`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.4)"
        : "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  width: "100%",
  alignItems: "center",
  ".MuiAlert-icon": {
    fontSize: "1.5rem",
    padding: theme.spacing(0.5),
    borderRadius: "50%",
    marginRight: theme.spacing(2),
  },
  ".MuiAlert-message": {
    padding: theme.spacing(1, 0),
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  "&.MuiAlert-standardSuccess": {
    backgroundColor: "transparent",
    color: theme.palette.success.main,
    ".MuiAlert-icon": {
      color: theme.palette.success.main,
      backgroundColor: theme.palette.success.light + "20",
    },
  },
  "&.MuiAlert-standardError": {
    backgroundColor: "transparent",
    color: theme.palette.error.main,
    ".MuiAlert-icon": {
      color: theme.palette.error.main,
      backgroundColor: theme.palette.error.light + "20",
    },
  },
  "&.MuiAlert-standardWarning": {
    backgroundColor: "transparent",
    color: theme.palette.warning.main,
    ".MuiAlert-icon": {
      color: theme.palette.warning.main,
      backgroundColor: theme.palette.warning.light + "20",
    },
  },
  "&.MuiAlert-standardInfo": {
    backgroundColor: "transparent",
    color: theme.palette.info.main,
    ".MuiAlert-icon": {
      color: theme.palette.info.main,
      backgroundColor: theme.palette.info.light + "20",
    },
  },
}));

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const iconMap = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};

const Toast = ({
  open,
  message,
  severity = "info",
  autoHideDuration = 6000,
  onClose,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
}) => {
  return (
    <StyledSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      TransitionComponent={SlideTransition}>
      <StyledAlert
        onClose={onClose}
        severity={severity}
        variant="standard"
        icon={iconMap[severity]}>
        {message}
      </StyledAlert>
    </StyledSnackbar>
  );
};

export default Toast;
