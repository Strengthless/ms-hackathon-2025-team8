import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
  useDataProvider,
  useNotify,
  useRedirect,
} from "react-admin";
import { assignmentTypes } from "../../constants";

export const AssignmentCreate = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = async (data: any) => {
    try {
      // Create assignments for each selected student
      const promises = data.assigned_to.map((studentId: string) =>
        dataProvider.create("assignments", {
          data: {
            id: data.id,
            type: data.type,
            assigned_to: studentId,
            detail: data.detail,
            created_at: new Date().toISOString(),
          },
        }),
      );

      await Promise.all(promises);
      notify("Assignment created successfully", { type: "success" });
      redirect("list", "assignments");
    } catch (error) {
      console.error("Error creating assignments:", error);
      notify("Error creating assignments", { type: "error" });
    }
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput source="id" label="Assignment ID" required />
        <SelectInput source="type" choices={assignmentTypes} required />
        <ReferenceArrayInput source="assigned_to" reference="students">
          <SelectArrayInput optionText="id" />
        </ReferenceArrayInput>
        <TextInput
          source="detail"
          fullWidth
          multiline
          rows={4}
          label="Assignment Details (JSON)"
        />
      </SimpleForm>
    </Create>
  );
};
