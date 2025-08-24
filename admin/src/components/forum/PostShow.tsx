import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  BooleanField,
  NumberField,
  useRecordContext,
  useDataProvider,
  useDelete,
  useNotify,
} from "react-admin";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { InlineCommentCreate } from "./InlineCommentCreate";

interface Comment {
  id: number;
  value: string;
  author: string;
  created_at: string;
  likes: number;
  anonymous: boolean;
}

const PostComments = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const [deleteOne] = useDelete();
  const notify = useNotify();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    if (!record?.id) return;

    try {
      const { data } = await dataProvider.getList("comments", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "created_at", order: "ASC" },
        filter: { post: record.id },
      });
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [record?.id, dataProvider]);

  const fetchCommentsAfterDelay = useCallback(async () => {
    setTimeout(fetchComments, 200);
  }, [fetchComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDeleteClick = (commentId: number) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (commentToDelete === null) return;

    try {
      await deleteOne("comments", { id: commentToDelete });
      notify("Comment deleted successfully", { type: "success" });
      // Refresh comments after deletion
      fetchCommentsAfterDelay();
    } catch {
      notify("Error deleting comment", { type: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No comments yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {comments.map((comment) => (
            <Paper key={comment.id} sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    {comment.anonymous ? "Anonymous" : comment.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(comment.id)}
                  title="Delete comment"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {comment.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ❤️ {comment.likes} likes
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <InlineCommentCreate onCommentAdded={fetchCommentsAfterDelay} />
    </Box>
  );
};

export const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" label="Title" />
      <TextField source="author" label="Author" />
      <DateField source="created_at" label="Created At" showTime />
      <NumberField source="likes" label="Likes" />
      <BooleanField source="is_public" label="Public" />
      <BooleanField source="anonymous" label="Anonymous" />
      <TextField source="details" label="Content" />
      <PostComments />
    </SimpleShowLayout>
  </Show>
);
