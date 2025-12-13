import { gql, useMutation } from "@apollo/client";

export const reply_email = gql`
  mutation ReplyEmail($input: ReplyEmail!) {
    replyEmail(input: $input) {
      id
      textBody
      htmlBody
      threadId
      subject
    }
  }
`;

function toSnakeCaseInput(input: any) {
  const snake: any = {
    parent_id: input.parentId,
    subject: input.subject,
    html_body: input.htmlBody,
    text_body: input.textBody,
    replyAll: input.replyAll,
  };

  return snake;
}

export const useReplyEmail = () => {
  const [replyEmailMutation, { loading, error, data }] =
    useMutation(reply_email);

  const replyEmail = async (input: any) => {
    const snake = toSnakeCaseInput(input);
    console.log("Sending snake_case input:", snake);

    try {
      const result = await replyEmailMutation({
        variables: { input: snake },
      });

      return result.data?.replyEmail;
    } catch (err) {
      console.error("Error creating email:", err);
      throw err;
    }
  };

  return { replyEmail, loading, error, data };
};