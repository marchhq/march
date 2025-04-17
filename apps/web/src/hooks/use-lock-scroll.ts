import { useEffect } from "react";

export function useLockScroll(lock: boolean) {
  useEffect(() => {
    if (!lock) return;

    // Get original styles
    const originalStyles = {
      overflow: window.getComputedStyle(document.body).overflow,
      touchAction: window.getComputedStyle(document.body).touchAction,
    };
    
    // Prevent scrolling and zooming
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Prevent wheel events
    const preventDefault = (e: Event) => e.preventDefault();
    
    // Prevent wheel and touchmove events
    document.addEventListener('wheel', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });

    // Add meta viewport tag to prevent zooming
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    document.head.appendChild(viewportMeta);

    // Get existing viewport meta
    const existingMeta = document.querySelector('meta[name="viewport"]');
    const originalContent = existingMeta?.getAttribute('content');
    
    // Re-enable scrolling and zooming when component unmounts
    return () => {
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.touchAction = originalStyles.touchAction;
      document.removeEventListener('wheel', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
      
      // Restore original viewport meta
      if (originalContent) {
        viewportMeta.content = originalContent;
      } else {
        viewportMeta.remove();
      }
    };
  }, [lock]);
} 