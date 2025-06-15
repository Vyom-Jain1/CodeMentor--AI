import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  styled,
  Zoom,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  CheckCircle as ConfirmIcon,
  Error as DangerIcon,
} from "@mui/icons-material";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 20,
    padding: theme.spacing(2),
    background:
      theme.palette.mode === "dark"
        ? "rgba(17, 25, 40, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
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

const DialogIconWrapper = styled(Box)(({ theme, variant }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: "50%",
  marginRight: theme.spacing(2),
  backgroundColor: alpha(
    theme.palette[variant || "primary"].main,
    theme.palette.mode === "dark" ? 0.2 : 0.1
  ),
  color: theme.palette[variant || "primary"].main,
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  ...(variant === "danger" && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
      transform: "translateY(-2px)",
    },
  }),
  ...(variant === "confirm" && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
      transform: "translateY(-2px)",
    },
  }),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "rotate(90deg)",
    color: theme.palette.error.main,
  },
}));

const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning", // 'warning', 'danger', 'confirm'
  TransitionComponent = Zoom,
}) => {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <DangerIcon fontSize="large" />;
      case "confirm":
        return <ConfirmIcon fontSize="large" />;
      default:
        return <WarningIcon fontSize="large" />;
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onCancel}
      TransitionComponent={TransitionComponent}
      maxWidth="xs"
      fullWidth>
      <CloseButton onClick={onCancel} aria-label="close">
        <CloseIcon />
      </CloseButton>

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          pt: 2,
          pb: 1,
        }}>
        <DialogIconWrapper variant={variant}>{getIcon()}</DialogIconWrapper>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="text.secondary" sx={{ ml: 8 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}>
          {cancelLabel}
        </Button>
        <ActionButton
          onClick={onConfirm}
          variant={variant === "danger" ? "danger" : "confirm"}>
          {confirmLabel}
        </ActionButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ConfirmationDialog;
