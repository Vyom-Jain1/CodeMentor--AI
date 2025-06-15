import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Psychology,
  School,
  Work,
  Star,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";

const BehavioralPrep = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const categories = [
    {
      name: "Leadership",
      icon: <Work />,
      questions: [
        "Tell me about a time when you led a team through a difficult situation.",
        "Describe a situation where you had to make a tough decision.",
        "How do you handle conflicts within your team?",
      ],
    },
    {
      name: "Problem Solving",
      icon: <Psychology />,
      questions: [
        "Tell me about a time when you had to solve a complex problem.",
        "Describe a situation where you had to think outside the box.",
        "How do you approach challenges when you don't have all the information?",
      ],
    },
    {
      name: "Teamwork",
      icon: <School />,
      questions: [
        "Tell me about a time when you had to work with a difficult team member.",
        "Describe a successful team project you were part of.",
        "How do you contribute to a team's success?",
      ],
    },
  ];

  const handleOpenDialog = (question) => {
    setSelectedQuestion(question);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQuestion(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Behavioral Interview Preparation
      </Typography>
      <Typography variant="body1" paragraph>
        Practice answering behavioral questions commonly asked in interviews.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} key={category.name}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {category.icon}
                  <Typography variant="h5" sx={{ ml: 1 }}>
                    {category.name}
                  </Typography>
                </Box>
                <List>
                  {category.questions.map((question, index) => (
                    <React.Fragment key={question}>
                      <ListItem>
                        <ListItemIcon>
                          <Star color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={question} />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDialog(question)}>
                          Practice
                        </Button>
                      </ListItem>
                      {index < category.questions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Practice Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth>
        <DialogTitle>Practice Your Answer</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedQuestion}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Your Answer"
            placeholder="Type your answer here..."
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Tips:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Star color="primary" />
              </ListItemIcon>
              <ListItemText primary="Use the STAR method (Situation, Task, Action, Result)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Star color="primary" />
              </ListItemIcon>
              <ListItemText primary="Be specific and provide concrete examples" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Star color="primary" />
              </ListItemIcon>
              <ListItemText primary="Focus on your role and contributions" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary">
            Save Answer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BehavioralPrep;
