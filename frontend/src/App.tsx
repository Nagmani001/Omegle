import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import Room from "./pages/room";

export default function App() {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/room" element={<Room />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </div>
}

