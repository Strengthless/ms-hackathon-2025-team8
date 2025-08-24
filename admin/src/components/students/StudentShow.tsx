import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  useRecordContext,
  useDataProvider,
  Link,
} from "react-admin";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { assignmentTypes } from "../../constants";

const StudentPortfolio = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!record?.id) return;

      try {
        // Get assignments for this student
        const { data: assignments } = await dataProvider.getList(
          "assignments",
          {
            pagination: { page: 1, perPage: 100 },
            sort: { field: "created_at", order: "DESC" },
            filter: { assigned_to: record.id },
          },
        );

        // Get submissions for these assignments
        const assignmentIds = assignments.map((a: any) => a.id);
        let submissions: any[] = [];

        if (assignmentIds.length > 0) {
          const { data: subs } = await dataProvider.getList("submissions", {
            pagination: { page: 1, perPage: 100 },
            sort: { field: "created_at", order: "DESC" },
            filter: {
              student_id: record.id,
            },
          });
          submissions = subs.filter((s) =>
            assignmentIds.includes(s.assignment_id),
          );
        }

        // Calculate performance metrics
        const completedSubmissions = submissions.filter((s) => s.is_final);
        const completionRate =
          assignments.length > 0
            ? (completedSubmissions.length / assignments.length) * 100
            : 0;
        const averageGrade =
          completedSubmissions.length > 0
            ? completedSubmissions.reduce(
                (sum: number, s: any) => sum + (s.grade || 0),
                0,
              ) / completedSubmissions.length
            : 0;

        // Calculate skill scores based on assignment types and grades
        const skillScores = {
          0: 5,
          1: 5,
          2: 5,
          3: 5,
          4: 5,
        };

        // Update skill scores based on actual submissions
        submissions.forEach((submission: any) => {
          const assignment = assignments.find(
            (a: any) => a.id === submission.assignment_id,
          );
          if (assignment && submission.grade) {
            const type = Number(assignment.type);
            // Map assignment type to skill (this would need to be customized based on your type mapping)

            if (type === 0) skillScores[0] = submission.grade;
            else if (type === 1) skillScores[1] = submission.grade;
            else if (type === 2) skillScores[2] = submission.grade;
            else if (type === 3) skillScores[3] = submission.grade;
            else if (type === 4) skillScores[4] = submission.grade;
          }
        });

        setStudentData({
          assignments,
          submissions,
          completionRate,
          averageGrade,
          skillScores,
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [record, dataProvider]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!studentData) return null;

  const radarData = [
    {
      subject: "Alphabet recognition",
      A: studentData.skillScores[0],
      fullMark: 100,
    },
    {
      subject: "Sight word recognition",
      A: studentData.skillScores[1],
      fullMark: 100,
    },
    {
      subject: "Vocabulary",
      A: studentData.skillScores[2],
      fullMark: 100,
    },
    {
      subject: "Point and read",
      A: studentData.skillScores[3],
      fullMark: 100,
    },
    {
      subject: "Phonemic awareness",
      A: studentData.skillScores[4],
      fullMark: 100,
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Student Portfolio
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Radar Chart */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Skills Assessment
          </Typography>
          <Box sx={{ height: 200, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Student"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Statistics */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Performance Metrics
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Completion Rate:</strong>{" "}
              {studentData.completionRate.toFixed(1)}%
            </Typography>
            <Typography variant="body1">
              <strong>Average Grade:</strong>{" "}
              {studentData.averageGrade.toFixed(1)}%
            </Typography>
            <Typography variant="body1">
              <strong>Total Assignments:</strong>{" "}
              {studentData.assignments.length}
            </Typography>
            <Typography variant="body1">
              <strong>Completed:</strong>{" "}
              {studentData.submissions.filter((s: any) => s.is_final).length}
            </Typography>
          </Box>
        </Paper>

        {/* Assignments List */}
        <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Assignments
            </Typography>
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "8px", textAlign: "left" }}>ID</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Type</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>
                      Created
                    </th>
                    <th style={{ padding: "8px", textAlign: "left" }}>
                      Status
                    </th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.assignments.map((assignment: any) => {
                    const submission = studentData.submissions.find(
                      (s: any) => s.assignment_id === assignment.id,
                    );
                    return (
                      <tr
                        key={assignment.id}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={{ padding: "8px" }}>
                          <Link to={`/assignments/${assignment.id}/show`}>
                            {assignment.id}
                          </Link>
                        </td>
                        <td style={{ padding: "8px" }}>
                          {assignmentTypes[assignment.type].name}
                        </td>
                        <td style={{ padding: "8px" }}>
                          {new Date(assignment.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "8px" }}>
                          {submission ? (
                            <Link to={`/submissions/${submission.id}/show`}>
                              {submission.is_final
                                ? "Completed"
                                : "In Progress"}
                            </Link>
                          ) : (
                            "Not Started"
                          )}
                        </td>
                        <td style={{ padding: "8px" }}>
                          {submission?.grade ? `${submission.grade}%` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export const StudentShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="Username" />
      <DateField source="created_at" label="Created At" showTime />
      <StudentPortfolio />
    </SimpleShowLayout>
  </Show>
);
