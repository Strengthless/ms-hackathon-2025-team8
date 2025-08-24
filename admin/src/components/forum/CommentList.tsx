import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  NumberField,
  ReferenceField,
  DeleteButton,
} from "react-admin";

export const CommentList = () => (
  <List>
    <Datagrid>
      <TextField source="value" label="Comment" />
      <TextField source="author" label="Author" />
      <ReferenceField source="post" reference="posts" label="Post" />
      <DateField source="created_at" label="Created At" showTime />
      <NumberField source="likes" label="Likes" />
      <BooleanField source="anonymous" label="Anonymous" />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);
