import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./pages/room";
import Disconnected from "./pages/disconnected";

export default function App() {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/room" element={<Room />} />
        <Route path="/disconnected" element={<Disconnected />} />
      </Routes>
    </BrowserRouter>
  </div>
}

