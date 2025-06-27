import { useMutation } from "@apollo/client"
import { UpdateUserDocument } from "../../../types/graphql"
import type { UpdateUserInput } from "../../../types/graphql"

export const useUpdateUser = () => {
  const [updateUserMutation] = useMutation(UpdateUserDocument)

  const updateUser = async (id: string, input: UpdateUserInput) => {
    try {
      const inputWithId: UpdateUserInput = {
        ...input,
        id
      }
      
      const result = await updateUserMutation({
        variables: { id, input },
      })
      return result.data?.updateUser
    } catch (err) {
      console.error("Error updating user:", err)
      throw err
    }
  }

  return {
    updateUser
  }
}