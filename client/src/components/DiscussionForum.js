import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { format } from "date-fns";
import {
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
} from "@mui/icons-material";
import { problemsAPI } from "../services/api";

// Memoize the DiscussionItem component
const DiscussionItem = memo(({ discussion, onLike, onReply }) => {
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    if (replyContent.trim()) {
      await onReply(discussion._id, replyContent);
      setReplyContent("");
      setShowReplyDialog(false);
    }
  };

  return (
    <ListItem alignItems="flex-start" sx={{ flexDirection: "column" }}>
      <Box sx={{ display: "flex", width: "100%", alignItems: "flex-start" }}>
        <ListItemAvatar>
          <Avatar src={discussion.user.avatar} alt={discussion.user.username} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Typography variant="subtitle1">
                {discussion.user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(discussion.createdAt), "MMM d, yyyy h:mm a")}
              </Typography>
            </Box>
          }
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary">
                {discussion.content}
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <IconButton size="small" onClick={() => onLike(discussion._id)}>
                  <ThumbUpIcon fontSize="small" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {discussion.likes}
                  </Typography>
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setShowReplyDialog(true)}>
                  <ReplyIcon fontSize="small" />
                </IconButton>
              </Box>
            </>
          }
        />
      </Box>

      {discussion.replies?.length > 0 && (
        <List sx={{ pl: 4, width: "100%" }}>
          {discussion.replies.map((reply) => (
            <ListItem key={reply._id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={reply.user.avatar} alt={reply.user.username} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <Typography variant="subtitle2">
                      {reply.user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(reply.createdAt), "MMM d, yyyy h:mm a")}
                    </Typography>
                  </Box>
                }
                secondary={reply.content}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={showReplyDialog} onClose={() => setShowReplyDialog(false)}>
        <DialogTitle>Reply to Discussion</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={3}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            id="reply-content-input"
            label="Your reply"
            aria-label="Write your reply to the discussion"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReplyDialog(false)}>Cancel</Button>
          <Button onClick={handleReply} variant="contained">
            Reply
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
});

DiscussionItem.displayName = "DiscussionItem";

const DiscussionForum = ({ problemId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDiscussions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await problemsAPI.getDiscussions(problemId);
      setDiscussions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch discussions");
    } finally {
      setIsLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await problemsAPI.createDiscussion(problemId, {
        content: newDiscussion.content,
      });
      setDiscussions([...discussions, response.data.data]);
      setNewDiscussion({ content: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create discussion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (discussionId) => {
    try {
      await problemsAPI.likeDiscussion(discussionId);
      setDiscussions(
        discussions.map((discussion) =>
          discussion._id === discussionId
            ? { ...discussion, likes: (discussion.likes || 0) + 1 }
            : discussion
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to like discussion");
    }
  };

  const handleReply = async (discussionId, content) => {
    try {
      const response = await problemsAPI.replyToDiscussion(
        discussionId,
        content
      );
      setDiscussions(
        discussions.map((discussion) =>
          discussion._id === discussionId
            ? {
                ...discussion,
                replies: [...discussion.replies, response.data.data],
              }
            : discussion
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reply to discussion");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Discussion Forum
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={newDiscussion.content}
          onChange={(e) =>
            setNewDiscussion({ ...newDiscussion, content: e.target.value })
          }
          placeholder="Start a discussion..."
          id="new-discussion-content"
          label="Discussion Content"
          aria-label="Write your discussion content"
          sx={{ mb: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={!newDiscussion.content.trim()}>
          Post Discussion
        </Button>
      </Box>

      <List>
        {discussions.map((discussion) => (
          <React.Fragment key={discussion._id}>
            <DiscussionItem
              discussion={discussion}
              onLike={handleLike}
              onReply={handleReply}
            />
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default memo(DiscussionForum);
