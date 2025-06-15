import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import {
  Person,
  Email,
  Star,
  EmojiEvents,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { authAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords do not match");
      return false;
    }
    if (formData.newPassword && !formData.currentPassword) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const { data } = await authAPI.updateProfile(updateData);
      await updateUser(data);
      setSuccess("Profile updated successfully");
      setEditMode(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: "primary.main",
            fontSize: "2.5rem",
          }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box flex={1}>
          <Typography variant="h4" gutterBottom>
            {user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Member since {new Date(user?.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Button
          variant={editMode ? "outlined" : "contained"}
          startIcon={editMode ? <CancelIcon /> : <EditIcon />}
          onClick={editMode ? handleCancel : () => setEditMode(true)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </Button>
      </Box>
      <Grid container spacing={3}>
        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <Person
                          sx={{ mr: 1, color: "text.secondary" }}
                          aria-hidden="true"
                        />
                      ),
                    }}
                    aria-label="Full Name"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <Email
                          sx={{ mr: 1, color: "text.secondary" }}
                          aria-hidden="true"
                        />
                      ),
                    }}
                    aria-label="Email Address"
                    required
                  />
                </Grid>
                {editMode && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" gutterBottom>
                        Change Password
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        aria-label="Current Password"
                        required={formData.newPassword !== ""}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        aria-label="New Password"
                        required={formData.currentPassword !== ""}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        aria-label="Confirm New Password"
                        required={formData.newPassword !== ""}
                      />
                    </Grid>
                  </>
                )}
                {editMode && (
                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={loading}
                        aria-label="Cancel changes">
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        aria-label="Save profile changes"
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} aria-hidden="true" />
                          ) : (
                            <SaveIcon aria-hidden="true" />
                          )
                        }>
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </form>
          </Card>
        </Grid>
        {/* Stats Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CodeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Problems Solved"
                    secondary={user?.stats?.totalSolved || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Success Rate"
                    secondary={`${Math.round(
                      ((user?.stats?.correctSubmissions || 0) /
                        (user?.stats?.totalSubmissions || 1)) *
                        100
                    )}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmojiEvents color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Rank" />
                </ListItem>
              </List>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Top Categories
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {user?.stats?.topCategories?.map((category, index) => (
                    <Chip
                      key={index}
                      label={category.name
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
