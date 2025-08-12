"use client"

import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import MailContainer from "../features/mail/MailContainer"
import LoginContainer from "../features/login/LoginContainer"
import RegisterContainer from "../features/register/RegisterContainer"
import MyMeContainer from "../features/presentation/MyMeContainer"
import PrivateRoute from "../components/PrivateRoute"
import PublicRoute from "../components/PublicRoute"

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mail" replace />} />

      {/* Rutas privadas */}
      <Route path="/mail/*" element={<PrivateRoute><MailContainer /></PrivateRoute>} />
      <Route path="/presentation/myme" element={<PublicRoute><MyMeContainer /></PublicRoute>} />

      {/* Rutas públicas con redirección*/}
      <Route path="/login" element={<PublicRoute redirectIfAuthenticated><LoginContainer /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute redirectIfAuthenticated><RegisterContainer /></PublicRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>

  )
}

export default AppRoutes
