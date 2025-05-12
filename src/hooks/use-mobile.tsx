
import * as React from "react"

// Breakpoints aligned with Tailwind's default breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < BREAKPOINTS.md)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

// Additional hook to get specific breakpoint information
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS) {
  const [isBelow, setIsBelow] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check
    setIsBelow(window.innerWidth < BREAKPOINTS[breakpoint])
    
    const handleResize = () => {
      setIsBelow(window.innerWidth < BREAKPOINTS[breakpoint])
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isBelow
}
