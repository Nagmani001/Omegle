import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./pages/room";

export default function App() {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  </div>
}

