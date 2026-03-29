import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/CaLebWork/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright');
import { mkdir } from 'fs/promises';

const OUT = '.playwright-mcp/edge';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: 'msedge',
  headless: false,
});

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Landing page (unauthenticated look first)
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${OUT}/01-landing.png` });
console.log('1. Landing:', page.url());

// Go to recipes — should redirect or show content if signed in
await page.goto('http://localhost:3001/recipes', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/02-recipes.png` });
console.log('2. Recipes:', page.url());

// Check if sidebar is present
const sidebar = await page.$('[class*="sidebar"]');
console.log('Sidebar present:', !!sidebar);

// Check html class
const htmlClass = await page.evaluate(() => document.documentElement.className);
console.log('HTML class:', htmlClass);

// Check console errors
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

// Homepage
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/03-home-authenticated.png` });
console.log('3. Home (authed):', page.url());

await browser.close();
console.log('Done. Screenshots in', OUT);
