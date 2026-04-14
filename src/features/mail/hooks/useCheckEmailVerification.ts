import { gql, useQuery } from "@apollo/client";

const check_email_verification = gql`
  query CheckEmailVerification($email: String!) {
    checkEmailVerification(email: $email) {
      status
      message
    }
  }
`;

function toSnakeCaseInput(input: any) {
  const snake: any = {
    email: input.email,
  };

  return snake;
}

export const useCheckEmailVerification = () => {
  const { data, loading, error, refetch } = useQuery(
    check_email_verification,
    {
      skip: true,
    }
  )

  const checkEmailVerification = async (email: string) => {
    if (!email.trim()) return

    const result = await refetch({ email })

    return result.data?.checkEmailVerification
  }

  return { checkEmailVerification, loading, error, data }
}