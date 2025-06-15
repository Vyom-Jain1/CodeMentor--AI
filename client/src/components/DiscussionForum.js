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
  Menu,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { format } from "date-fns";
import {
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { problemsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

// Memoize the DiscussionItem component
const DiscussionItem = memo(({ discussion, onLike, onReply, onDelete }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(discussion._id);
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(discussion._id, replyContent);
    setReplyContent("");
    setShowReplyForm(false);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={discussion.user.avatar}
            alt={discussion.user.username}
            sx={{ mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" component="div">
              {discussion.user.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(discussion.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </Box>
          {user && user._id === discussion.user._id && (
            <>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {discussion.content}
        </Typography>
        {discussion.problem && (
          <Chip label={discussion.problem.title} size="small" sx={{ mr: 1 }} />
        )}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <IconButton
            size="small"
            onClick={() => onLike(discussion._id)}
            color={
              discussion.likedBy?.includes(user?._id) ? "primary" : "default"
            }>
            <ThumbUpIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ mr: 2 }}>
            {discussion.likes || 0}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setShowReplyForm(!showReplyForm)}>
            <ReplyIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption">
            {discussion.replies?.length || 0} replies
          </Typography>
        </Box>
        {showReplyForm && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleReply}
              disabled={!replyContent.trim()}>
              Reply
            </Button>
          </Box>
        )}
        {discussion.replies?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            {discussion.replies.map((reply) => (
              <Box key={reply._id} sx={{ ml: 4, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    src={reply.user.avatar}
                    alt={reply.user.username}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography variant="subtitle2">
                    {reply.user.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}>
                    {formatDistanceToNow(new Date(reply.createdAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
                <Typography variant="body2">{reply.content}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

DiscussionItem.displayName = "DiscussionItem";

const DiscussionForum = ({ problemId }) => {
  const { user } = useAuth();
  const [state, setState] = useState({
    discussions: [],
    newDiscussion: "",
    isLoading: false,
    error: null,
    sortBy: "latest",
    filter: "all",
    page: 1,
    hasMore: true,
    totalCount: 0,
    searchQuery: "",
    retryCount: 0,
    retryAttempts: 0,
    retryTimeout: null,
    isRateLimited: false,
    rateLimitTime: 0,
    lastFetchTime: 0,
    sortAnchorEl: null,
    filterAnchorEl: null,
  });

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const fetchDiscussions = useCallback(
    async (reset = false) => {
      try {
        // Prevent duplicate requests within 2 seconds
        const now = Date.now();
        if (now - state.lastFetchTime < 2000) {
          return;
        }

        if (reset) {
          updateState({
            page: 1,
            discussions: [],
            hasMore: true,
            retryCount: 0,
            retryAttempts: 0,
          });
        }

        if (!state.hasMore || state.isLoading || state.isRateLimited) return;

        updateState({
          isLoading: true,
          error: null,
          lastFetchTime: now,
        });

        let response;
        try {
          // Use different API endpoints based on whether problemId is provided
          response = problemId
            ? await problemsAPI.getDiscussions(problemId, {
                page: reset ? 1 : state.page,
                limit: 10,
                sortBy: state.sortBy,
              })
            : await problemsAPI.getAllDiscussions({
                page: reset ? 1 : state.page,
                limit: 10,
                sortBy: state.sortBy,
              });
        } catch (err) {
          // Handle 404 errors specifically
          if (err.response?.status === 404) {
            updateState({
              error: problemId
                ? "No discussions found for this problem yet."
                : "No discussions found.",
              discussions: [],
              hasMore: false,
              totalCount: 0,
            });
            return;
          }
          throw err;
        }

        if (!response.data.success) {
          throw new Error(response.data.error || "Failed to fetch discussions");
        }

        const { discussions, totalCount, hasMore } = response.data.data;

        // Update cache
        const cacheKey = problemId
          ? `discussions_${problemId}`
          : "all_discussions";
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            discussions: reset
              ? discussions
              : [...state.discussions, ...discussions],
            timestamp: now,
            totalCount,
            hasMore,
          })
        );

        updateState({
          discussions: reset
            ? discussions
            : [...state.discussions, ...discussions],
          totalCount,
          hasMore,
          page: reset ? 2 : state.page + 1,
          retryCount: 0,
          retryAttempts: 0,
          isRateLimited: false,
          rateLimitTime: 0,
        });
      } catch (err) {
        console.error("Error fetching discussions:", err);

        // Handle rate limiting
        if (err.isRateLimit) {
          const waitTime =
            err.waitTime || parseInt(err.message.match(/\d+/)[0]);
          const retryAttempts = state.retryAttempts + 1;

          updateState({
            error: `Rate limited. Please wait ${waitTime} seconds... (Attempt ${retryAttempts}/3)`,
            isRateLimited: true,
            rateLimitTime: waitTime,
            retryAttempts,
          });

          // Clear any existing timeout
          if (state.retryTimeout) {
            clearTimeout(state.retryTimeout);
          }

          // Set new timeout with exponential backoff
          const backoffTime = Math.min(
            1000 * Math.pow(2, retryAttempts),
            waitTime * 1000
          );
          const timeout = setTimeout(() => {
            if (retryAttempts < 3) {
              updateState({
                isRateLimited: false,
                rateLimitTime: 0,
                error: null,
              });
              fetchDiscussions(reset);
            } else {
              updateState({
                error:
                  "Maximum retry attempts reached. Please try again later.",
                isRateLimited: false,
                rateLimitTime: 0,
              });
            }
          }, backoffTime);

          updateState({ retryTimeout: timeout });
        } else {
          updateState({
            error: err.message || "Failed to fetch discussions",
            hasMore: false,
          });
        }
      } finally {
        updateState({ isLoading: false });
      }
    },
    [
      problemId,
      state.page,
      state.sortBy,
      state.filter,
      state.discussions,
      state.retryCount,
      state.isRateLimited,
      state.lastFetchTime,
      state.retryAttempts,
      updateState,
    ]
  );

  // Load cached discussions on mount
  useEffect(() => {
    const cacheKey = problemId ? `discussions_${problemId}` : "all_discussions";
    const cachedData = JSON.parse(localStorage.getItem(cacheKey) || "{}");
    if (
      cachedData.discussions &&
      cachedData.timestamp &&
      Date.now() - cachedData.timestamp < 5 * 60 * 1000 // 5 minutes cache
    ) {
      updateState({
        discussions: cachedData.discussions,
        page: Math.ceil(cachedData.discussions.length / 10) + 1,
        totalCount: cachedData.totalCount,
        hasMore: cachedData.hasMore,
      });
    } else {
      fetchDiscussions(true);
    }

    return () => {
      // Cleanup timeout on unmount
      if (state.retryTimeout) {
        clearTimeout(state.retryTimeout);
      }
    };
  }, [problemId, fetchDiscussions, updateState]);

  // Handle search and filter changes with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!state.isLoading && !state.isRateLimited) {
        fetchDiscussions(true);
      }
    }, 1000); // Increased debounce time to 1 second

    return () => clearTimeout(debounceTimer);
  }, [state.searchQuery, state.sortBy, state.filter]);

  // Handle infinite scroll with throttling
  useEffect(() => {
    let scrollTimeout;
    let lastScrollTime = 0;
    const THROTTLE_DELAY = 500; // Increased throttle delay to 500ms

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < THROTTLE_DELAY) return;
      lastScrollTime = now;

      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 // Increased threshold
        ) {
          if (!state.isLoading && state.hasMore && !state.isRateLimited) {
            fetchDiscussions();
          }
        }
        scrollTimeout = null;
      }, THROTTLE_DELAY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [state.isLoading, state.hasMore, state.isRateLimited, fetchDiscussions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.newDiscussion.trim()) return;

    try {
      updateState({ isLoading: true, error: null });

      const response = problemId
        ? await problemsAPI.createDiscussion(problemId, state.newDiscussion)
        : await problemsAPI.createGeneralDiscussion(state.newDiscussion);

      if (response.error) {
        throw new Error(response.error);
      }

      updateState({
        discussions: [response.data, ...state.discussions],
        newDiscussion: "",
      });
    } catch (err) {
      console.error("Error creating discussion:", err);
      updateState({
        error: err.message || "Failed to create discussion",
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const handleLike = async (discussionId) => {
    try {
      updateState({ error: null });

      const response = await problemsAPI.likeDiscussion(discussionId);
      if (response.error) {
        throw new Error(response.error);
      }

      updateState({
        discussions: state.discussions.map((discussion) =>
          discussion._id === discussionId
            ? {
                ...discussion,
                likes: (discussion.likes || 0) + 1,
                isLiked: true,
                likedBy: response.data.likedBy,
              }
            : discussion
        ),
      });
    } catch (err) {
      console.error("Error liking discussion:", err);
      updateState({ error: err.message || "Failed to like discussion" });
    }
  };

  const handleReply = async (discussionId, content) => {
    try {
      const response = await problemsAPI.replyToDiscussion(
        discussionId,
        content
      );
      updateState({
        discussions: state.discussions.map((discussion) =>
          discussion._id === discussionId
            ? { ...discussion, replies: [...discussion.replies, response.data] }
            : discussion
        ),
      });
    } catch (err) {
      console.error("Error replying to discussion:", err);
      updateState({ error: err.message || "Failed to reply to discussion" });
    }
  };

  const handleDelete = async (discussionId) => {
    try {
      const response = await problemsAPI.deleteDiscussion(discussionId);
      if (response.success) {
        updateState({
          discussions: state.discussions.filter((d) => d._id !== discussionId),
        });
      }
    } catch (err) {
      console.error("Error deleting discussion:", err);
      updateState({ error: err.message || "Failed to delete discussion" });
    }
  };

  const handleSortClick = (event) => {
    updateState({ sortAnchorEl: event.currentTarget });
  };

  const handleFilterClick = (event) => {
    updateState({ filterAnchorEl: event.currentTarget });
  };

  const handleSortClose = () => {
    updateState({ sortAnchorEl: null });
  };

  const handleFilterClose = () => {
    updateState({ filterAnchorEl: null });
  };

  const handleSortSelect = (value) => {
    updateState({ sortBy: value });
    updateState({ page: 1 });
    updateState({ discussions: [] });
    handleSortClose();
  };

  const handleFilterSelect = (value) => {
    updateState({ filter: value });
    updateState({ page: 1 });
    updateState({ discussions: [] });
    handleFilterClose();
  };

  if (state.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        {problemId ? "Problem Discussions" : "General Discussions"}
      </Typography>

      {state.error && (
        <Alert
          severity={state.isRateLimited ? "warning" : "error"}
          sx={{ mb: 2 }}
          action={
            state.isRateLimited && <CircularProgress size={20} sx={{ ml: 1 }} />
          }>
          {state.error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={state.newDiscussion}
            onChange={(e) => updateState({ newDiscussion: e.target.value })}
            placeholder="Start a new discussion..."
            variant="outlined"
            disabled={state.isLoading}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!state.newDiscussion.trim() || state.isLoading}
              startIcon={
                state.isLoading ? <CircularProgress size={20} /> : <SendIcon />
              }>
              Post Discussion
            </Button>
          </Box>
        </form>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          startIcon={<SortIcon />}
          onClick={handleSortClick}
          variant="outlined">
          Sort by: {state.sortBy}
        </Button>
        <Button
          startIcon={<FilterIcon />}
          onClick={handleFilterClick}
          variant="outlined">
          Filter: {state.filter}
        </Button>
      </Box>

      <Menu
        anchorEl={state.sortAnchorEl}
        open={Boolean(state.sortAnchorEl)}
        onClose={handleSortClose}>
        <MenuItem onClick={() => handleSortSelect("latest")}>Latest</MenuItem>
        <MenuItem onClick={() => handleSortSelect("oldest")}>Oldest</MenuItem>
        <MenuItem onClick={() => handleSortSelect("popular")}>Popular</MenuItem>
      </Menu>
      <Menu
        anchorEl={state.filterAnchorEl}
        open={Boolean(state.filterAnchorEl)}
        onClose={handleFilterClose}>
        <MenuItem onClick={() => handleFilterSelect("all")}>All</MenuItem>
        <MenuItem onClick={() => handleFilterSelect("popular")}>
          Popular
        </MenuItem>
      </Menu>

      <List>
        {state.discussions.map((discussion) => (
          <React.Fragment key={discussion._id}>
            <DiscussionItem
              discussion={discussion}
              onLike={handleLike}
              onReply={handleReply}
              onDelete={handleDelete}
            />
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>

      {state.isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {!state.isLoading && state.discussions.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}>
          No discussions yet. Be the first to start a conversation!
        </Typography>
      )}
    </Box>
  );
};

export default memo(DiscussionForum);
