import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import MainRoom from "./pages/mainRoom";

export default function App() {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/room" element={<MainRoom />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </div>
}

