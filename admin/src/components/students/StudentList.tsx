import {
  List,
  Datagrid,
  DateField,
  ShowButton,
  TextField,
  DeleteButton,
} from "react-admin";

export const StudentList = () => (
  <List
    render={(value) => {
      if (!value.data) return null;

      value.data = value.data.filter((user) => user.id !== "admin");
      return (
        <Datagrid rowClick="show">
          <TextField source="id" label="Username" />
          <DateField source="created_at" label="Created At" showTime />
          <ShowButton />
          <DeleteButton mutationMode="optimistic" />
        </Datagrid>
      );
    }}
  ></List>
);
