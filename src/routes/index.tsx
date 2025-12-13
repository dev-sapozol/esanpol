"use client"

import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import MailContainer from "../features/mail/MailContainer"
import AuthPage from "../features/auth/AuthPage"
import Login from "../features/auth/login/Login"
import Register from "../features/auth/register/Register"
import Recovery from "../features/auth/recovery/Recovery"
import { authConfig } from "../config/auth";
import { PrivateRoute } from "./PrivateRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<AuthPage />}>
        <Route path="login" element={<Login {...authConfig} />} />
        <Route path="register" element={<Register />} />
        <Route path="recovery" element={<Recovery />} />
      </Route>

      {/* Private routes */}
      <Route
        path="/mail/*"
        element={
          <PrivateRoute>
            <MailContainer />
          </PrivateRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/mail" replace />} />

      {/* Not found */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  )
}

export default AppRoutes
