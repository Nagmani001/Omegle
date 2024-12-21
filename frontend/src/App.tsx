import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./pages/room";
import OmegleChat from "./components/chat";

export default function App() {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/room" element={<Room />} />
        <Route path="/test" element={<OmegleChat />} />
      </Routes>
    </BrowserRouter>
  </div>
}

