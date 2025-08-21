import * as React from "react";

const SIDEBAR_WIDTH_KEY = 'mealPlanSidebarWidth';
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const DEFAULT_WIDTH = 300;

export const useSidebarResize = () => {
  const [sidebarWidth, setSidebarWidth] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
    }
    return DEFAULT_WIDTH;
  });

  const [isResizing, setIsResizing] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Handle media query changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) {return;}
      
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Save sidebar width to localStorage when resizing is done
      if (typeof window !== 'undefined' && !isMobile) {
        localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isResizing, sidebarWidth, isMobile]);

  return {
    sidebarWidth,
    isResizing,
    isMobile,
    handleMouseDown,
  };
};