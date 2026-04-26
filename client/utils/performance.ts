// Performance utilities for the Housing Allocation System

// Debounce function for search and input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll events and animations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Performance monitoring
export class PerformanceMonitor {
  static measurePageLoad(pageName: string) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`[Performance] ${pageName} loaded in ${duration.toFixed(2)}ms`);
        return duration;
      }
    };
  }

  static measureComponentRender(componentName: string) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        if (duration > 100) { // Log slow renders
          console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
        }
        return duration;
      }
    };
  }

  static logNavigation(from: string, to: string) {
    console.log(`[Navigation] ${from} → ${to}`);
  }
}

// Optimized image loading
export function optimizeImageLoading(img: HTMLImageElement) {
  img.loading = 'lazy';
  img.decoding = 'async';
}

// Memory cleanup utility
export function cleanupMemory() {
  if ('gc' in window && typeof (window as any).gc === 'function') {
    (window as any).gc();
  }
}

// Route prefetching for better UX
export function prefetchRoute(router: any, path: string) {
  if (typeof router.prefetch === 'function') {
    router.prefetch(path);
  }
}

// Fast redirect utility
export function fastRedirect(router: any, path: string, message?: string) {
  if (message) {
    console.log(`[Redirect] ${message} → ${path}`);
  }
  
  // Use replace for faster navigation when appropriate
  if (path.includes('/dashboard')) {
    router.replace(path);
  } else {
    router.push(path);
  }
}
