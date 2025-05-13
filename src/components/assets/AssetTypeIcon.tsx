
import { 
  Monitor,
  SmartphoneIcon,
  TabletIcon,
  MouseIcon,
  KeyboardIcon,
  PackageIcon
} from "lucide-react";
import { AssetType } from "@/lib/types";

interface AssetTypeIconProps {
  type: AssetType;
  size?: number;
}

const AssetTypeIcon = ({ type, size = 18 }: AssetTypeIconProps) => {
  switch (type) {
    case "laptop":
      return <Monitor size={size} />;
    case "smartphone":
      return <SmartphoneIcon size={size} />;
    case "tablet":
      return <TabletIcon size={size} />;
    case "mouse":
      return <MouseIcon size={size} />;
    case "keyboard":
      return <KeyboardIcon size={size} />;
    case "accessory":
      return <PackageIcon size={size} />;
    default:
      return <PackageIcon size={size} />;
  }
};

export default AssetTypeIcon;
