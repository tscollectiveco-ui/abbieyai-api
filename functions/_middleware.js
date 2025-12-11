/**
 * Cloudflare Pages Functions Middleware
 * This file routes API requests to the worker while serving static assets from /public
 */

// Import the worker logic
import worker from '../src/index.js';

/**
 * Main middleware handler
 */
export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Define API routes that should be handled by the worker
  const apiRoutes = ['/chat', '/greeting', '/templates', '/health'];
  
  // Check if this is an API route
  const isApiRoute = apiRoutes.some(route => path === route || path.startsWith(route + '/'));
  
  // For API routes, use the worker
  if (isApiRoute) {
    return worker.fetch(request, env, context);
  }
  
  // For root path, we could either serve index.html or API response
  // Let's check if it's a browser request
  const acceptHeader = request.headers.get('accept') || '';
  if (path === '/' && acceptHeader.includes('text/html')) {
    // Serve the index.html for browser requests
    return next();
  } else if (path === '/') {
    // Serve API response for non-browser requests
    return worker.fetch(request, env, context);
  }
  
  // For all other routes, serve static assets
  return next();
}
