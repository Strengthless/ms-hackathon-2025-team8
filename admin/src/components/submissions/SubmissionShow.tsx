import {
  Show,
  SimpleShowLayout,
  useRecordContext,
  ReferenceField,
  useDataProvider,
  TextField,
} from "react-admin";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { assignmentTypes } from "../../constants";
import { useEffect, useState } from "react";

const SubmissionDetails = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const [assignment, setAssignment] = useState<any | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      const assignment = await dataProvider.getOne("assignments", {
        id: record?.assignment_id,
      });
      setAssignment(assignment.data);
      console.log(assignment.data);
    };
    fetchAssignment();
  }, [record?.assignment_id, dataProvider]);

  if (!record) {
    return <Typography>No submission data found.</Typography>;
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Submission Overview */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Submission Overview
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto auto",
            gap: 2,
          }}
        >
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
              Status
            </Typography>
            <Chip
              label={record.is_final ? "Final" : "Draft"}
              color={record.is_final ? "success" : "warning"}
              size="small"
            />
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
              Grade
            </Typography>
            <Typography variant="body1">
              {record.grade ? `${record.grade}%` : "Not graded"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Feedback
            </Typography>
            <Typography variant="body1">
              {record.feedback || "No feedback provided"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Submission Data */}
      {record.details && (
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
            }}
          >
            {JSON.stringify(record.details, null, 2)}
          </Box>
        </Paper>
      )}

      {/* Assignment Information */}
      {assignment && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Assignment Information
          </Typography>
          {/* <ReferenceField source="assignment_id" reference="assignments"> */}
          <Box
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Assignment ID
              </Typography>
              <ReferenceField source="assignment_id" reference="assignments">
                <TextField source="id" />
              </ReferenceField>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Type
              </Typography>
              <Typography variant="body1">
                {assignmentTypes[Number(assignment.type)]?.name ||
                  `Type ${assignment.type}`}
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
            <Box sx={{ gridColumn: "span 2" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Details
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
                {JSON.stringify(assignment.detail, null, 2)}
              </Box>
            </Box>
          </Box>
          {/* </ReferenceField> */}
        </Paper>
      )}
    </Box>
  );
};

export const SubmissionShow = () => (
  <Show>
    <SimpleShowLayout>
      <SubmissionDetails />
    </SimpleShowLayout>
  </Show>
);
