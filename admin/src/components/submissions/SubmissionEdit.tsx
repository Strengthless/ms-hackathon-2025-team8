import {
  Edit,
  SimpleForm,
  NumberInput,
  BooleanInput,
  TextInput,
  useRecordContext,
} from "react-admin";
import { Box, Typography, Paper } from "@mui/material";
import { assignmentTypes } from "../../constants";

const SubmissionEditForm = () => {
  const record = useRecordContext();

  if (!record) {
    return <Typography>No submission data found.</Typography>;
  }

  return (
    <SimpleForm>
      {/* Submission Overview */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Submission Overview
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Student ID
            </Typography>
            <Typography variant="body1">{record.student_id}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Assignment ID
            </Typography>
            <Typography variant="body1">{record.assignment_id}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Assignment Type
            </Typography>
            <Typography variant="body1">
              {assignmentTypes[record.type]?.name || `Type ${record.type}`}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Submitted At
            </Typography>
            <Typography variant="body1">
              {new Date(record.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Current Status
            </Typography>
            <Typography variant="body1">
              {record.is_final ? "Final" : "Draft"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Grading Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Grading
        </Typography>
        <NumberInput
          source="grade"
          label="Grade (%)"
          min={0}
          max={100}
          helperText="Enter a grade between 0 and 100"
        />
        <TextInput
          source="feedback"
          label="Feedback"
          multiline
          rows={4}
          fullWidth
          helperText="Provide constructive feedback to the student"
        />
        <BooleanInput
          source="is_final"
          label="Mark as Final Submission"
          helperText="Check this if this is the student's final submission"
        />
      </Paper>

      {/* Submission Data Display */}
      {record.data && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Submission Data
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              overflow: "auto",
              fontSize: "0.875rem",
              maxHeight: "400px",
            }}
          >
            {JSON.stringify(record.data, null, 2)}
          </Box>
        </Paper>
      )}
    </SimpleForm>
  );
};

export const SubmissionEdit = () => (
  <Edit>
    <SubmissionEditForm />
  </Edit>
);
