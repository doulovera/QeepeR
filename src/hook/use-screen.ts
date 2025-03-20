import { useState, useEffect } from 'react'

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints: Record<Exclude<ScreenSize, 'xs'>, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Order of screen sizes from smallest to largest
const sizeOrder: ScreenSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

// Helper function to check if a size is at least a certain size
export const isAtLeast = (
  current: ScreenSize,
  minimum: ScreenSize,
): boolean => {
  return sizeOrder.indexOf(current) >= sizeOrder.indexOf(minimum)
}

export const useScreen = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('xs')

  useEffect(() => {
    // Function to determine the screen size
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width >= breakpoints['2xl']) {
        setScreenSize('2xl')
      } else if (width >= breakpoints.xl) {
        setScreenSize('xl')
      } else if (width >= breakpoints.lg) {
        setScreenSize('lg')
      } else if (width >= breakpoints.md) {
        setScreenSize('md')
      } else if (width >= breakpoints.sm) {
        setScreenSize('sm')
      } else {
        setScreenSize('xs')
      }
    }

    // Set initial screen size
    updateScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', updateScreenSize)

    // Clean up event listener
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  // Return screen size and helper functions
  return {
    size: screenSize,
    isXs: screenSize === 'xs',
    isSm: screenSize === 'sm',
    isMd: screenSize === 'md',
    isLg: screenSize === 'lg',
    isXl: screenSize === 'xl',
    is2Xl: screenSize === '2xl',
    atLeastSm: isAtLeast(screenSize, 'sm'),
    atLeastMd: isAtLeast(screenSize, 'md'),
    atLeastLg: isAtLeast(screenSize, 'lg'),
    atLeastXl: isAtLeast(screenSize, 'xl'),
    atLeast2Xl: isAtLeast(screenSize, '2xl'),
  }
}
