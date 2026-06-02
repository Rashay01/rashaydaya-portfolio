import type { Metadata } from 'next'
import { Syne, JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { Toaster } from 'sonner'
import { ContactProvider } from '@/context/ContactContext'
import { ContactDialog } from '@/components/ui/ContactDialog'
import './globals.css'

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

// Cal Sans is loaded via @font-face in globals.css (see public/fonts/CalSans-SemiBold.woff2)
// Download: https://github.com/calcom/font/raw/main/CalSans-SemiBold.woff2
// Until the file is present, Georgia is used as fallback.

export const metadata: Metadata = {
  metadataBase: new URL('https://rashaydaya.co.za'),
  title: 'Rashay Daya — DevOps & Full Stack Developer',
  description:
    'DevOps & Full Stack Developer. Building resilient CI/CD pipelines, distributed infrastructure, and full-stack systems at scale. Johannesburg, South Africa.',
  keywords: [
    'DevOps Engineer',
    'Full Stack Developer',
    'CI/CD',
    'AWS',
    'React',
    'TypeScript',
    'Rashay Daya',
    'Johannesburg',
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
    siteName: 'Rashay Daya — Technical Vanguard',
    title: 'Rashay Daya — DevOps & Full Stack Developer',
    description:
      'Infrastructure-to-interface ownership. CI/CD pipelines, distributed systems, full-stack applications.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rashay Daya — DevOps & Full Stack Developer',
    description:
      'Infrastructure-to-interface ownership. CI/CD pipelines, distributed systems, full-stack applications.',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rashay Daya',
  jobTitle: 'DevOps & Full Stack Developer',
  description:
    'DevOps & Full Stack Developer specialising in CI/CD automation, cloud infrastructure, and full-stack application development.',
  url: 'https://rashaydaya.co.za',
  sameAs: [
    'https://github.com/Rashay01',
    'https://za.linkedin.com/in/rashay-daya-795804262',
  ],
  knowsAbout: [
    'AWS',
    'Terraform',
    'GitHub Actions',
    'Kubernetes',
    'React',
    'TypeScript',
    'Python',
    'CI/CD',
    'DevOps',
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of the Witwatersrand',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Sanlam',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Johannesburg',
    addressCountry: 'ZA',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rashay Daya — Technical Vanguard',
  url: 'https://rashaydaya.co.za',
  author: {
    '@type': 'Person',
    name: 'Rashay Daya',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jetbrainsMono.variable} ${GeistSans.variable}`}
    >
      <head>
        <link
          rel="preload"
          href="/fonts/CalSans-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
          <ContactDialog />
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
