import { Show, SimpleShowLayout, useRecordContext } from "react-admin";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { assignmentTypes } from "../../constants";

const AssignmentDetails = () => {
  const record = useRecordContext();

  if (!record) {
    return <Typography>No assignment data found.</Typography>;
  }

  const assignmentType = assignmentTypes.find(
    (t) => t.id === Number(record.type),
  );

  // Handle the case where assigned_to might be an array or string
  const assignedStudents = Array.isArray(record.assigned_to)
    ? record.assigned_to
    : [record.assigned_to];

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Assignment Overview */}
      <Box style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr 1fr" }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Assignment Overview
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Assignment ID
              </Typography>
              <Typography variant="body1">{record.id}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Type
              </Typography>
              <Typography variant="body1">
                {assignmentType ? assignmentType.name : `Type ${record.type}`}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {new Date(record.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Students Assigned
              </Typography>
              <Typography variant="body1">{assignedStudents.length}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Assigned Students */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Assigned Students
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {assignedStudents.map((studentId: string) => (
              <Chip
                key={studentId}
                label={studentId}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Assignment Details */}
      {record.detail && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Assignment Details
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              overflow: "auto",
              fontSize: "0.875rem",
            }}
          >
            {JSON.stringify(record.detail, null, 2)}
          </Box>
        </Paper>
      )}

      {/* Note about submissions */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Submissions
        </Typography>
        <Typography color="text.secondary">
          Submissions for this assignment can be viewed in the Submissions
          section.
        </Typography>
      </Paper>
    </Box>
  );
};

export const AssignmentShow = () => (
  <Show>
    <SimpleShowLayout>
      <AssignmentDetails />
    </SimpleShowLayout>
  </Show>
);
