import { gql, useMutation } from "@apollo/client";

const check_email_verification = gql`
  mutation CheckExternalEmail($email: String!) {
    checkExternalEmail(email: $email) {
      status
      message
    }
  }
`;

export const useCheckEmailVerification = () => {
  const [checkMutation, { loading, error, data }] =
    useMutation(check_email_verification);

  const checkEmailVerification = async (email: string) => {
    if (!email.trim()) return;

    const result = await checkMutation({
      variables: { email },
    });

    return result.data?.checkExternalEmail;
  };

  return { checkEmailVerification, loading, error, data };
};