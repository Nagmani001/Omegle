import { useMediaQuery } from "react-responsive"
import MobileRoom from "./mobileRoom";
import Room from "./room";

export default function MainRoom() {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  console.log(isMobile)
  return <div>
    {isMobile ? <MobileRoom /> : <Room />}
  </div>
}
