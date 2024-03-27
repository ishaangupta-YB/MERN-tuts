import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
const Dashboard = lazy(() => import("./Components/Dashboard"));
const Landing = lazy(() => import("./Components/Landing"));



function App() {

  return (
    <>
      <BrowserRouter>
        <AppBar />
        <Routes>
          <Route path="/dashboard" element={<Suspense fallback={'Loading...'}><Dashboard /></Suspense>} />
          <Route path="/" element={<Suspense fallback={'Loading...'}><Landing /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const AppBar = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/")}>Landing</button>
    </div>
  );
};

export default App;
