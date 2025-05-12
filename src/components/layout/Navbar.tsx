
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "./MobileNavbar";
import { DesktopSidebar } from "./DesktopSidebar";

export default function Navbar() {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? <MobileNavbar /> : <DesktopSidebar />}
    </>
  );
}
