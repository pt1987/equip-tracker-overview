
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackClassName?: string;
  onLoadingComplete?: () => void;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  fallbackClassName,
  onLoadingComplete,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoadingComplete?.();
  };

  return (
    <>
      {!loaded && (
        <div className={cn(
          "flex items-center justify-center bg-muted/30 animate-pulse", 
          className
        )}>
          <svg className="w-10 h-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24">
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
            />
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M10 16H14M11.5 8.5C11.5 9.32843 10.8284 10 10 10C9.17157 10 8.5 9.32843 8.5 8.5C8.5 7.67157 9.17157 7 10 7C10.8284 7 11.5 7.67157 11.5 8.5ZM15.5 8.5C15.5 9.32843 14.8284 10 14 10C13.1716 10 12.5 9.32843 12.5 8.5C12.5 7.67157 13.1716 7 14 7C14.8284 7 15.5 7.67157 15.5 8.5Z"
            />
          </svg>
        </div>
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={cn(
          className,
          error && fallbackClassName,
          !loaded && "hidden"
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}
