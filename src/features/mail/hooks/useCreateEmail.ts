import { gql, useMutation } from "@apollo/client";

const IMPORTANCE_MAP: Record<string, number> = {
  low: 0,
  normal: 1,
  high: 2,
}

const sendEmail = gql`
   mutation SendEmail($input: SendEmail!) {
    sendEmail(input: $input) {
      id
      to
      cc
      subject
      preview
      is_read
      has_attachment
      importance
      folder_id
      inserted_at
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
    html_body: wrapEmailBody(input.htmlBody),
  };

  if (input.cc) snake.cc = input.cc;
  if (input.bcc) snake.bcc = input.bcc;
  if (input.hasAttachment !== undefined) snake.has_attachment = input.hasAttachment;
  if (input.folderId !== undefined) snake.folder_id = input.folderId;

  return snake;
}

export const useCreateEmail = () => {
  const [sendEmailMutation, { loading, error, data }] =
    useMutation(sendEmail);

  const createEmail = async (input: any) => {
    const snake = toSnakeCaseInput(input);

    console.log("Sending input:", snake);

    const result = await sendEmailMutation({
      variables: { input: snake },
    });

    return result.data?.sendEmail;
  };

  return { createEmail, loading, error, data };
};

function wrapEmailBody(html: string) {
  return `
<div class="email-body">
${html}
</div>
`.trim()
}

