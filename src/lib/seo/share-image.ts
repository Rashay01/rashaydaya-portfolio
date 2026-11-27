// Child pages that set their own openGraph/twitter objects replace the root
// metadata instead of merging with it, which silently dropped the site-wide
// opengraph-image from every note and case study. Pages that override those
// objects spread this in so shares still get a preview card.
export const SHARE_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Rashay Daya, DevOps and full stack developer',
}
