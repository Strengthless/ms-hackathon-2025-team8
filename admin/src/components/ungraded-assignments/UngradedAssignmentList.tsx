import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  useRecordContext,
  Button,
  NumberField,
  ShowButton,
  Labeled,
  BooleanField,
} from "react-admin";
import { Chip } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatusField = (_props: { label: string }) => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Chip
      label={record.is_final ? "Final" : "Draft"}
      color={record.is_final ? "success" : "warning"}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FeedbackField = (_props: { label: string }) => {
  const record = useRecordContext();

  if (!record) return null;

  return record.feedback ? "✓" : "";
};

const GradeButton = () => {
  const record = useRecordContext();
  if (!record) return null;

  if (!record.is_final) return null;

  return (
    <Button
      label={record.grade ? "Edit" : "Grade"}
      to={`/submissions/${record.id}/edit`}
      variant="contained"
      color={record.grade ? "inherit" : "primary"}
      size="small"
    />
  );
};

export const UngradedAssignmentList = () => (
  <List
    filter={{}}
    title="Submissions"
    sort={{ field: "created_at", order: "DESC" }}
  >
    <Datagrid>
      {/* <TextField source="id" /> */}
      <DateField source="created_at" label="Submitted at" showTime />
      <ReferenceField source="assignment_id" reference="assignments">
        <TextField source="type" />
      </ReferenceField>
      <TextField source="student_id" />
      <StatusField label="Status" />
      <NumberField source="grade" defaultValue={"N/A"} />
      <FeedbackField label="Feedback" />
      <ShowButton />
      <GradeButton />
    </Datagrid>
  </List>
);
