
import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface AssetImageProps {
  imageUrl: string | undefined;
  altText: string;
}

export default function AssetImage({ imageUrl, altText }: AssetImageProps) {
  const getAssetImage = () => {
    if (!imageUrl || imageUrl.trim() === '') {
      return `/placeholder.svg`;
    }
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch (e) {
      return `/placeholder.svg`;
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div 
        className="w-full"
        initial={{
          opacity: 0,
          scale: 1.05
        }} 
        animate={{
          opacity: 1,
          scale: 1
        }} 
        transition={{
          duration: 0.5
        }}
      >
        <ImageWithFallback
          src={getAssetImage()} 
          alt={altText} 
          className="max-h-[360px] w-auto object-contain mx-auto" 
          fallbackClassName="p-8 bg-muted/30"
        />
      </motion.div>
    </div>
  );
}
