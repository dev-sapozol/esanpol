import { useState, useCallback } from "react"
import { gql, useQuery } from "@apollo/client"

const LIST_EXTERNAL_EMAILS = gql`
  query ListExternalEmails {
    listExternalEmails {
      id
      email
    }
  }
`

export type ExternalEmail = {
  id: string
  email: string
}

export function useListExternalEmails() {
  const { data, loading, error } = useQuery(LIST_EXTERNAL_EMAILS, {
    fetchPolicy: "cache-first",
  })

  const emails: ExternalEmail[] = data?.listExternalEmails ?? []

  return { emails, loading, error }
}