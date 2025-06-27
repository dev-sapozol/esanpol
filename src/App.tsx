import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes"
import { UserProvider } from "./context/UserContext" 

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
