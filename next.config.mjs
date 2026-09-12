export function createSecurityHeaders(nodeEnv = process.env.NODE_ENV) {
  const isDevelopment = nodeEnv === 'development'
  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    'https://static.cloudflareinsights.com',
    'https://www.googletagmanager.com',
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ].join(' ')
  const connectSources = [
    "'self'",
    'https://api.resend.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    ...(isDevelopment
      ? ['http://localhost:*', 'ws://localhost:*', 'ws://127.0.0.1:*']
      : []),
  ].join(' ')

  return [
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "style-src 'self' 'unsafe-inline'",
        'script-src ' + scriptSources,
        'connect-src ' + connectSources,
        'upgrade-insecure-requests',
      ].join('; '),
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=()',
    },
  ]
}

export const securityHeaders = createSecurityHeaders()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion'],
    viewTransition: true,
  },
  // Consolidate every www.* request onto the apex host so Google indexes a
  // single URL per page. Canonical tags already point at the apex; without
  // this redirect www.rashaydaya.co.za served duplicate 200 responses.
  // Two rules rather than one '/:path*' catch-all: OpenNext leaves an empty
  // optional param uncompiled in absolute destinations, so the bare root
  // would otherwise redirect to a literal '/:path*'.
  async redirects() {
    const wwwHost = [{ type: 'host', value: 'www.rashaydaya.co.za' }]
    return [
      {
        source: '/',
        has: wwwHost,
        destination: 'https://rashaydaya.co.za/',
        permanent: true,
      },
      {
        source: '/:path+',
        has: wwwHost,
        destination: 'https://rashaydaya.co.za/:path+',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

if (process.env.NODE_ENV === 'development') {
  const { initOpenNextCloudflareForDev } = await import('@opennextjs/cloudflare')
  initOpenNextCloudflareForDev()
}

export default nextConfig
