import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
  useDataProvider,
  useRecordContext,
} from "react-admin";
import { assignmentTypes } from "../../constants";
import { Box, Typography } from "@mui/material";

const AssignmentEditForm = () => {
  const record = useRecordContext();

  return (
    <SimpleForm>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Assignment ID: {record?.id}
        </Typography>
      </Box>

      <SelectInput source="type" choices={assignmentTypes} required />
      <ReferenceArrayInput source="assigned_to" reference="students">
        <SelectArrayInput optionText="id" />
      </ReferenceArrayInput>
      <TextInput
        source="detail"
        format={(value) => JSON.stringify(value, null, 2)}
        fullWidth
        multiline
        rows={16}
        label="Assignment Details (JSON)"
      />
    </SimpleForm>
  );
};

export const AssignmentEdit = () => (
  <Edit>
    <AssignmentEditForm />
  </Edit>
);
