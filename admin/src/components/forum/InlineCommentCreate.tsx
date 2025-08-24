import { useCreate, useNotify, useRecordContext } from "react-admin";
import { Box, Typography, Paper, Button, TextField } from "@mui/material";
import { useState } from "react";

interface InlineCommentCreateProps {
  onCommentAdded: () => void;
}

export const InlineCommentCreate = ({
  onCommentAdded,
}: InlineCommentCreateProps) => {
  const record = useRecordContext();
  const [create] = useCreate();
  const notify = useNotify();
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      notify("Comment cannot be empty", { type: "error" });
      return;
    }

    if (!record?.id) {
      notify("Post not found", { type: "error" });
      return;
    }

    try {
      await create("comments", {
        data: {
          post: record.id,
          value: comment.trim(),
          author: "admin",
          anonymous: false,
          likes: 0,
        },
      });

      notify("Comment added successfully", { type: "success" });
      setComment("");
      onCommentAdded();
    } catch {
      notify("Error adding comment", { type: "error" });
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add Comment as Admin
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Comment"
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!comment.trim()}
          >
            Add Comment
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
