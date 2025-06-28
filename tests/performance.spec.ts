import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Home page loads within performance budget', async ({ page }) => {
    // Navigate and measure
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for main content
    await page.waitForSelector('[data-testid="recipe-gallery"]', { timeout: 5000 });
    const loadTime = Date.now() - startTime;
    
    // Performance assertions
    expect(loadTime).toBeLessThan(3000); // Page loads in under 3s
    
    // Check Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'FCP') vitals.fcp = entry.value;
            if (entry.name === 'LCP') vitals.lcp = entry.value;
            if (entry.name === 'CLS') vitals.cls = entry.value;
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    console.log('Core Web Vitals:', vitals);
  });

  test('Recipe detail page performance', async ({ page }) => {
    // Test recipe page with TipTap editor
    await page.goto('/recipes/test-recipe-id');
    
    // Measure Time to Interactive
    const tti = await page.evaluate(() => {
      return performance.now();
    });
    
    // Check editor loads
    await page.waitForSelector('.ProseMirror', { timeout: 5000 });
    
    const editorLoadTime = await page.evaluate(() => {
      return performance.now();
    }) - tti;
    
    expect(editorLoadTime).toBeLessThan(2000); // Editor loads in under 2s
  });

  test('Bundle size in network tab', async ({ page }) => {
    // Monitor network requests
    const responses = [];
    page.on('response', (response) => {
      if (response.url().includes('.js')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'],
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total JS bundle size
    const totalSize = responses.reduce((sum, resp) => {
      return sum + (parseInt(resp.size) || 0);
    }, 0);
    
    console.log(`Total JS bundle size: ${totalSize / 1024}KB`);
    expect(totalSize).toBeLessThan(500 * 1024); // Under 500KB total JS
  });
});