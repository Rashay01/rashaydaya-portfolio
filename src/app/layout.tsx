import type { Metadata } from 'next'
import { Syne, JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { Toaster } from 'sonner'
import { ContactProvider } from '@/context/ContactContext'
import { LazyOverlays } from '@/components/ui/LazyOverlays'
import './globals.css'
import { buildPersonSchema, buildSoftwareSchemas, buildWebsiteSchema } from '@/lib/seo/structured-data'

// Syne — loaded as variable font; CSS font-variation-settings handles the 800→300 hover
const syne = Syne({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap',
})

// Cal Sans dropped from the font stack (see stu/memory.md, 2026-06-22).
// .font-calsans falls back to Georgia via --font-calsans in globals.css.

export const metadata: Metadata = {
  metadataBase: new URL('https://rashaydaya.co.za'),
  title: {
    default: 'Rashay Daya | Junior DevOps Engineer & Full Stack Developer',
    template: '%s | Rashay Daya',
  },
  description:
    'Portfolio of Rashay Daya, a Junior DevOps Engineer and Full Stack Developer based in Cape Town, South Africa. Building cloud infrastructure, CI/CD pipelines, APIs, automation, and production web platforms with AWS, Terraform, Cloudflare, GitHub Actions, React, Node.js, and TypeScript.',
  keywords: [
    'Rashay Daya',
    'Junior DevOps Engineer',
    'Full Stack Developer',
    'South Africa',
    'Western Cape',
    'Cape Town',
    'South Africa',
    'AWS',
    'Terraform',
    'GitHub Actions',
    'React',
    'Next.js',
    'TypeScript',
    'CI/CD',
    'Cloudflare',
    'Node.js',
  ],
  authors: [{ name: 'Rashay Daya' }],
  creator: 'Rashay Daya',
  alternates: {
    canonical: 'https://rashaydaya.co.za',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://rashaydaya.co.za',
    siteName: 'Rashay Daya | Portfolio',
    title: 'Rashay Daya | Junior DevOps Engineer & Full Stack Developer',
    description:
      'Portfolio of Rashay Daya, a Junior DevOps Engineer and Full Stack Developer based in Cape Town, South Africa. Building cloud infrastructure, CI/CD pipelines, APIs, automation, and production web platforms with AWS, Terraform, Cloudflare, GitHub Actions, React, Node.js, and TypeScript.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rashay Daya | Junior DevOps Engineer & Full Stack Developer',
    description:
      'Portfolio of Rashay Daya, a Junior DevOps Engineer and Full Stack Developer based in Cape Town, South Africa.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const jsonLd = [buildPersonSchema(), buildWebsiteSchema(), ...buildSoftwareSchemas()]
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${jetbrainsMono.variable} ${GeistSans.variable}`}
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-obsidian text-satin antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-filament focus:text-obsidian focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:rounded-sm"
        >
          Skip to main content
        </a>
        <ContactProvider>
          {children}
          {modal}
          <LazyOverlays />
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: 'var(--card)',
                border: '1px solid rgba(148,163,184,0.12)',
                color: 'var(--satin)',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                letterSpacing: '0.02em',
              },
            }}
          />
        </ContactProvider>
      </body>
    </html>
  )
}
