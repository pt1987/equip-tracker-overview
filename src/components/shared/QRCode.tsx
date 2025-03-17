
import ReactQRCode from "react-qr-code";
import { motion } from "framer-motion";

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  title?: string;
}

export default function QRCode({
  value,
  size = 128,
  bgColor = "#FFFFFF",
  fgColor = "#000000",
  level = "M",
  title,
}: QRCodeProps) {
  return (
    <motion.div 
      className="inline-flex flex-col items-center justify-center p-4 rounded-xl bg-white shadow-subtle"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {title && (
        <div className="mb-3 text-sm font-medium text-center">{title}</div>
      )}
      <ReactQRCode
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
      />
    </motion.div>
  );
}
