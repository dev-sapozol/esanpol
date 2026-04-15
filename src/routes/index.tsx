"use client";

import type React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import { authConfig } from "../config/auth";
import { PrivateRoute } from "./PrivateRoute";

type AppRoutesProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Lazy loaded pages (code splitting real)
 */
const MailContainer = lazy(() => import("../features/mail/MailContainer"));
const AuthPage = lazy(() => import("../features/auth/AuthPage"));
const Login = lazy(() => import("../features/auth/login/Login"));
const Register = lazy(() => import("../features/auth/register/Register"));
const Recovery = lazy(() => import("../features/auth/recovery/Recovery"));


const AppRoutes: React.FC<AppRoutesProps> = ({ darkMode, setDarkMode }) => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/auth"
        element={
          <AuthPage />
        }
      >
        <Route
          path="login"
          element={
            <Login {...authConfig} />
          }
        />

        <Route
          path="register"
          element={
            <Register {...authConfig} />
          }
        />

        <Route
          path="change-password"
          element={
            <Recovery
              verifyEmailEndpoint={authConfig.verifyEmailEndpoint}
              changePasswordEndpoint={authConfig.changePasswordEndpoint}
              labels={{
                emailPlaceholder: authConfig.labels.emailPlaceholder,
                passwordPlaceholder: authConfig.labels.passwordPlaceholder,
                emailButton: authConfig.labels.emailButton,
                invalidEmail: authConfig.labels.invalidEmail,
              }}
              onError={authConfig.onError}
            />
          }
        />
      </Route>

      {/* Private routes */}
      <Route
        path="/mail/*"
        element={
          <PrivateRoute>
            <MailContainer darkMode={darkMode} setDarkMode={setDarkMode} />
          </PrivateRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/mail" replace />} />

      {/* Not found */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

export default AppRoutes;
