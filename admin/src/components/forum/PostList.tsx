import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  NumberField,
  ShowButton,
  DeleteButton,
  Filter,
  BooleanInput,
  useRecordContext,
  useDataProvider,
  TextInput,
} from "react-admin";
import { useEffect, useState } from "react";
import { Box, Chip } from "@mui/material";

// Custom field to show comment count
const CommentCountField = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const [commentCount, setCommentCount] = useState<number | null>(null);

  // Note: this is a 1+n query, but it's ok for now
  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!record?.id) return;

      try {
        const { data } = await dataProvider.getList("comments", {
          pagination: { page: 1, perPage: 1000 },
          filter: { post: record.id },
        });
        setCommentCount(data.length);
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    fetchCommentCount();
  }, [record?.id, dataProvider]);

  return (
    <Box>
      <Chip
        label={`${commentCount ?? "?"} comments`}
        color={commentCount === 0 ? "warning" : "default"}
        size="small"
      />
    </Box>
  );
};

export const PostList = () => {
  const PostFilters = () => (
    <Filter>
      {/* <BooleanInput source="anonymous" label="Anonymous Posts Only" /> */}
      <BooleanInput
        source="no_comments"
        label="Posts with no comments"
        // alwaysOn
      />
      {/* <TextInput source="title" label="Search by title" /> */}
    </Filter>
  );

  return (
    <List filters={<PostFilters />}>
      <Datagrid>
        <TextField source="title" label="Title" />
        <TextField source="author" label="Author" />
        <DateField source="created_at" label="Created At" showTime />
        <NumberField source="likes" label="Likes" />
        <BooleanField source="is_public" label="Public" />
        <BooleanField source="anonymous" label="Anonymous" />
        <CommentCountField />
        <ShowButton />
        <DeleteButton mutationMode="pessimistic" />
      </Datagrid>
    </List>
  );
};
