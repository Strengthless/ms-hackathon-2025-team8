import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  ShowButton,
  CreateButton,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import { Box, Chip } from "@mui/material";
import { assignmentTypes } from "../../constants";

const AssignmentListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AssignmentStudents = (_props: { label: string }) => {
  const record = useRecordContext();

  if (!record) return <span>-</span>;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {record.assigned_to.map((student: string) => (
        <Chip
          key={student}
          label={student}
          size="small"
          variant="outlined"
          color="primary"
        />
      ))}
    </Box>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AssignmentTypeField = (_props: { label: string }) => {
  const record = useRecordContext();
  if (!record) return <span>-</span>;
  const type = assignmentTypes.find((t) => t.id === Number(record.type));
  return <span>{type ? type.name : `Type ${record.type}`}</span>;
};

export const AssignmentList = () => {
  return (
    <List
      actions={<AssignmentListActions />}
      render={({ data }) => {
        if (!data) return null;

        // group data by id, concatenating assigned_to
        interface AssignmentRecord {
          id: string;
          assigned_to: string;
          type: number;
          created_at: string;
          week?: string;
          detail?: string;
        }

        interface GroupedAssignmentRecord {
          id: string;
          assigned_to: string[];
          type: number;
          created_at: string;
          week?: string;
          detail?: string;
        }

        const groupedData = Object.values(data).reduce(
          (
            acc: Record<string, GroupedAssignmentRecord>,
            curr: AssignmentRecord,
          ) => {
            if (!acc[curr.id]) {
              acc[curr.id] = { ...curr, assigned_to: [curr.assigned_to] };
            } else {
              acc[curr.id].assigned_to = [
                ...acc[curr.id].assigned_to,
                curr.assigned_to,
              ];
            }
            return acc;
          },
          {},
        );

        console.log("groupedData", groupedData);

        return (
          <Datagrid data={Object.values(groupedData)} rowClick="show">
            <TextField source="id" label="Assignment ID" />
            <TextField source="week" label="Week" />
            <AssignmentTypeField label="Type" />
            <AssignmentStudents label="Students" />
            <DateField source="created_at" label="Created At" />
            <ShowButton />
            <EditButton />
          </Datagrid>
        );
      }}
    ></List>
  );
};
