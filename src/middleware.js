
// This file is automatically detected and executed by Vite during build
// It sets the appropriate security headers for better performance and security

/**
 * Configures security headers for the application
 * This should be used in conjunction with the appropriate server setup
 */
export function configureHeaders() {
  return {
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "frame-ancestors 'self'",
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
    
    // Cache control for static assets
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Type': 'text/html; charset=UTF-8',
  };
}

// Export any other middleware or helper functions here
