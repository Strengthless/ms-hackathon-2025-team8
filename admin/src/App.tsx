import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { StudentList } from "./components/students/StudentList";
import { StudentShow } from "./components/students/StudentShow";
import { AssignmentList } from "./components/assignments/AssignmentList";
import { AssignmentCreate } from "./components/assignments/AssignmentCreate";
import { AssignmentEdit } from "./components/assignments/AssignmentEdit";
import { AssignmentShow } from "./components/assignments/AssignmentShow";
import { UngradedAssignmentList } from "./components/ungraded-assignments";
import { SubmissionShow } from "./components/submissions/SubmissionShow";
import { SubmissionEdit } from "./components/submissions/SubmissionEdit";
import { PostList, PostShow } from "./components/forum";
import { supabaseDataProvider } from "ra-supabase";

const baseProvider = supabaseDataProvider({
  instanceUrl: "https://raagrtoqfqiafslninaj.supabase.co",
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYWdydG9xZnFpYWZzbG5pbmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MjQ3MDksImV4cCI6MjA3MTUwMDcwOX0.kD7k9S3_26Zh_eIr6U2niILdiHyjK2Dhs7QGUq21CIs",
});

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

const dataProvider = {
  ...baseProvider,
  getOne: async (resource: string, params: { id: string | number }) => {
    if (resource === "assignments") {
      // For assignments, we need to get all records with the same ID and group them
      const { data } = await baseProvider.getList(resource, {
        pagination: { page: 1, perPage: 100 },
        filter: { id: params.id },
      });

      if (data.length === 0) {
        throw new Error("Assignment not found");
      }

      // Group the data by ID and combine assigned_to arrays
      const groupedData = data.reduce(
        (acc: GroupedAssignmentRecord | null, curr: AssignmentRecord) => {
          if (!acc) {
            acc = { ...curr, assigned_to: [curr.assigned_to] };
          } else {
            acc.assigned_to = [...acc.assigned_to, curr.assigned_to];
          }
          return acc;
        },
        null,
      );

      return { data: groupedData };
    }

    // For other resources, use the default getOne
    return baseProvider.getOne(resource, params);
  },
  delete: async (resource: string, params: { id: string | number }) => {
    if (resource === "assignments") {
      // For assignments, delete all records with the same ID
      try {
        // First, get all records with this ID
        const { data } = await baseProvider.getList(resource, {
          pagination: { page: 1, perPage: 100 },
          filter: { id: params.id },
        });

        // Delete all records
        for (const record of data) {
          await baseProvider.delete(resource, { id: record.id });
        }

        return { data: { id: params.id } };
      } catch (error) {
        console.error("Error in assignment delete:", error);
        throw error;
      }
    }

    if (resource === "posts") {
      // When deleting a post, also delete all its comments
      try {
        // First, get all comments for this post
        const { data: comments } = await baseProvider.getList("comments", {
          pagination: { page: 1, perPage: 1000 },
          filter: { post: params.id },
        });

        // Delete all comments
        for (const comment of comments) {
          await baseProvider.delete("comments", { id: comment.id });
        }

        // Then delete the post
        return baseProvider.delete(resource, params);
      } catch (error) {
        console.error("Error in cascading delete:", error);
        throw error;
      }
    }

    // For other resources, use the default delete
    return baseProvider.delete(resource, params);
  },
  deleteMany: async (
    resource: string,
    params: { ids: (string | number)[] },
  ) => {
    if (resource === "assignments") {
      // For assignments, delete all records with the given IDs
      try {
        const deletePromises = params.ids.map(async (id) => {
          // Get all records with this ID
          const { data } = await baseProvider.getList(resource, {
            pagination: { page: 1, perPage: 100 },
            filter: { id },
          });

          // Delete all records with this ID
          const recordDeletePromises = data.map((record: AssignmentRecord) =>
            baseProvider.delete(resource, { id: record.id }),
          );

          await Promise.all(recordDeletePromises);
        });

        await Promise.all(deletePromises);
        return { data: params.ids };
      } catch (error) {
        console.error("Error in assignment deleteMany:", error);
        throw error;
      }
    }

    // For other resources, use the default deleteMany
    return baseProvider.deleteMany(resource, params);
  },
};

export const App = () => (
  <Admin dataProvider={dataProvider} layout={Layout} title="REACH Admin Panel">
    <Resource name="students" list={StudentList} show={StudentShow} />
    <Resource
      name="assignments"
      list={AssignmentList}
      create={AssignmentCreate}
      edit={AssignmentEdit}
      show={AssignmentShow}
    />
    <Resource
      name="submissions"
      list={UngradedAssignmentList}
      show={SubmissionShow}
      edit={SubmissionEdit}
    />
    <Resource name="posts" list={PostList} show={PostShow} />
    {/* <Resource name="comments" list={CommentList} create={CommentCreate} /> */}
  </Admin>
);
