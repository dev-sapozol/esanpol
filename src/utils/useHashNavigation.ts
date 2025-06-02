"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

/**
 * Custom hook to handle hash-based navigation
 * @param defaultHash The default hash to redirect to if none is present
 */
export const useHashNavigation = (defaultHash: string) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // If there's no hash in the URL, redirect to the default hash
    if (!location.hash) {
      navigate(`${location.pathname}#${defaultHash}`, { replace: true })
    }
  }, [location.pathname, location.hash, navigate, defaultHash])

  return {
    currentHash: location.hash.replace("#", "") || defaultHash,
    navigateToHash: (hash: string) => navigate(`${location.pathname}#${hash}`),
  }
}
