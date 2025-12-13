import { gql, useMutation } from "@apollo/client";

const IMPORTANCE_MAP: Record<string, number> = {
  low: 0,
  normal: 1,
  high: 2,
}

const sendEmail = gql`
  mutation CreateEmail($input: CreateEmail!) {
    createEmail(input: $input) {
      id
      user_id
      to
      cc
      subject
      preview
      inbox_type
      is_read
      has_attachment
      importance
      text_body
      html_body
      folder_id
      inserted_at
      updated_at
      sender_name
      sender_email
    }
  }
`;

function toSnakeCaseInput(input: any) {
  const snake: any = {
    user_id: input.userId,
    to: input.to,
    subject: input.subject,
    preview: input.preview,
    inbox_type: input.inboxType,
    importance: IMPORTANCE_MAP[input.importance] ?? 1,
    text_body: input.textBody,
    html_body: input.htmlBody,
  };

  if (input.cc) snake.cc = input.cc;
  if (input.bcc) snake.bcc = input.bcc;
  if (input.hasAttachment !== undefined) snake.has_attachment = input.hasAttachment;
  if (input.folderId !== undefined) snake.folder_id = input.folderId;

  return snake;
}

export const useCreateEmail = () => {
  const [createEmailMutation, { loading, error, data }] =
    useMutation(sendEmail);

  const createEmail = async (input: any) => {
    const snake = toSnakeCaseInput(input);
    console.log("Sending snake_case input:", snake);

    try {
      const result = await createEmailMutation({
        variables: { input: snake },
      });

      return result.data?.createEmail;
    } catch (err) {
      console.error("Error creating email:", err);
      throw err;
    }
  };

  return { createEmail, loading, error, data };
};
