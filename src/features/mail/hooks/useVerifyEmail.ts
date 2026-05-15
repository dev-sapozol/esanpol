import { gql, useMutation } from "@apollo/client";

const verify_email = gql`
  mutation VerifyExternalEmail($email: String!) {
    verifyExternalEmail(email: $email) {
      status
      message
    }
  }
`;

export const useVerifyEmail = () => {
  const [verifyEmailMutation, { loading, error, data }] =
    useMutation(verify_email);

  const verifyEmail = async (email: string) => {
    if (!email.trim()) return;

    const result = await verifyEmailMutation({
      variables: { email },
    });

    return result.data?.verifyExternalEmail;
  };

  return { verifyEmail, loading, error, data };
};