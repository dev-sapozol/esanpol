"use client"

import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import MailContainer from "../features/mail/MailContainer"

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/mail/*" element={<MailContainer />} />
      <Route path="/" element={<Navigate to="/mail" replace />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  )
}

export default AppRoutes
