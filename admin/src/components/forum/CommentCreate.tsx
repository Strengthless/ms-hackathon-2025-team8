import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
  useNotify,
  useRedirect,
} from "react-admin";

export const CommentCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify("Comment created successfully", { type: "success" });
    redirect("list", "comments");
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <ReferenceInput source="post" reference="posts" label="Post">
          <SelectInput optionText="title" />
        </ReferenceInput>
        <TextInput source="value" label="Comment" multiline rows={4} />
        <BooleanInput
          source="anonymous"
          label="Anonymous"
          defaultValue={false}
        />
        <TextInput
          source="author"
          label="Author"
          defaultValue="admin"
          disabled
        />
      </SimpleForm>
    </Create>
  );
};
