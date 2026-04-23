import { useState, useCallback, useRef } from "react"
import { gql, useLazyQuery } from "@apollo/client"

const SEARCH_USERS = gql`
  query SearchUser($query: String!) {
    searchUser(query: $query) {
      email
      name
      fathername
      mothername
      avatarUrl
    }
  }
`

export type UserSuggestion = {
  email: string
  name?: string
  fathername?: string
  mothername?: string
  avatarUrl?: string
}

export function useUserSearch() {
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [searchUsers, { loading }] = useLazyQuery(SEARCH_USERS, {
    onCompleted: (data) => {
      setSuggestions(data?.searchUser ?? [])
    },
    onError: () => setSuggestions([]),
  })

  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)

      if (!query.trim() || query.length < 2) {
        setSuggestions([])
        return
      }

      debounceRef.current = setTimeout(() => {
        searchUsers({ variables: { query } })
      }, 200)
    },
    [searchUsers]
  )

  const clear = useCallback(() => setSuggestions([]), [])

  return { suggestions, loading, search, clear }
}