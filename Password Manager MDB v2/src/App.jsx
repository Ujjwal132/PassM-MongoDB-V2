import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Lander from "./components/lander";
import AuthForm from "./components/AuthForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Lander/>
    },
    {
      path: "/auth",
      element: <div>
      <Navbar/>
      <AuthForm/>
    </div>
    },
    {
      path: "/main",
      element: <div>
      <Navbar/>
      <Manager/>
    </div>
    },
    {
      path: "*",
      element: <div>
      <Navbar/>
      <NotFound/>
    </div>
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
