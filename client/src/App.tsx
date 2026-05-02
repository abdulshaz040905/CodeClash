import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProblemPage from "./pages/ProblemPage";

function Home() {
  return <h1>Home</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem" element={<ProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
