"use client"

import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import MailContainer from "../features/mail/MailContainer"
import LoginContainer from "../features/login/LoginContainer"
import RegisterContainer from "../features/register/RegisterContainer"
import PrivateRoute from "../components/PrivateRoute"
import PublicRoute from "../components/PublicRoute"

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/mail/*" element={<PrivateRoute><MailContainer /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/mail" replace />} />
      <Route path="*" element={<div>Page not found</div>} />
      <Route path="/login" element={<PublicRoute><LoginContainer /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterContainer /></PublicRoute>} />
    </Routes>
  )
}

export default AppRoutes
