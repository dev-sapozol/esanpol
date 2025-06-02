import { useMutation } from "@apollo/client"
import { CreateEmailDocument } from "../../../types/graphql"
import type { CreateEmailInput } from "../../../types/graphql"

export const useCreateEmail = () => {
  const [createEmailMutation, { loading, error, data }] = useMutation(CreateEmailDocument)

  const createEmail = async (input: CreateEmailInput) => {
    try {
      const result = await createEmailMutation({
        variables: { input },
      })
      return result.data?.createEmail
    } catch (err) {
      console.error("Error creating email:", err)
      throw err
    }
  }

  return {
    createEmail,
    loading,
    error,
    data,
  }
}
