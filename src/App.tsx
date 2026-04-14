import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes"
import { useEffect, useState } from "react"

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved) return saved === "dark"

    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])



  return (
    <BrowserRouter>
      <AppRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
    </BrowserRouter>
  )
}

export default App