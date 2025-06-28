/**
 * Real User Monitoring (RUM) utilities
 * Tracks Core Web Vitals and custom performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
};

export function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  });

  // Track custom metrics
  trackPageLoadTime();
  trackResourceLoadTimes();
  trackEditorLoadTime();
}

function sendToAnalytics(metric: any) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  });

  // Send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }).catch(console.error);
  } else {
    console.log('Web Vital:', JSON.parse(body));
  }
}

function trackPageLoadTime() {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      sendToAnalytics({
        name: 'page-load-time',
        value: pageLoadTime,
        rating: getRating('TTFB', pageLoadTime),
      });
    }
  });
}

function trackResourceLoadTimes() {
  // Track slow resources
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 1000) { // Resources taking >1s
        sendToAnalytics({
          name: 'slow-resource',
          value: entry.duration,
          rating: 'poor',
          resourceUrl: (entry as any).name,
        });
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
}

function trackEditorLoadTime() {
  // Track TipTap editor initialization time
  const startTime = performance.now();
  
  const checkEditor = () => {
    const editor = document.querySelector('.ProseMirror');
    if (editor) {
      const editorLoadTime = performance.now() - startTime;
      sendToAnalytics({
        name: 'editor-load-time',
        value: editorLoadTime,
        rating: getRating('FCP', editorLoadTime),
      });
    } else if (performance.now() - startTime < 10000) {
      requestAnimationFrame(checkEditor);
    }
  };
  
  requestAnimationFrame(checkEditor);
}

// Performance monitoring for recipe operations
export function trackRecipeOperation(operation: string, startTime: number) {
  const duration = performance.now() - startTime;
  
  sendToAnalytics({
    name: `recipe-${operation}`,
    value: duration,
    rating: duration < 500 ? 'good' : duration < 1000 ? 'needs-improvement' : 'poor',
  });
}

// Memory usage monitoring
export function trackMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    sendToAnalytics({
      name: 'memory-usage',
      value: memory.usedJSHeapSize,
      rating: memory.usedJSHeapSize < 50 * 1024 * 1024 ? 'good' : 'poor', // 50MB threshold
    });
  }
}