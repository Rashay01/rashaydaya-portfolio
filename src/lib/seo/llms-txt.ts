import { caseStudies } from '@/lib/data/case-studies'
import { notes } from '@/lib/data/notes'
import { roadmap } from '@/lib/data/roadmap'
import { SITE_URL } from '@/lib/seo/structured-data'

// llms.txt (llmstxt.org): a plain-markdown map of the site for AI assistants.
// Built from the same data modules as the pages, so it can't drift from them.
export function buildLlmsTxt() {
  const published = notes.filter((note) => note.status === 'Published')
  return [
    '# Rashay Daya',
    '',
    '> Junior DevOps Engineer and Full Stack Developer in Cape Town, South Africa. Builds cloud infrastructure, CI/CD pipelines, APIs, automation, and production web platforms with AWS, Terraform, Cloudflare, GitHub Actions, React, Node.js, and TypeScript.',
    '',
    'Every claim on this site links back to a case study, a public repo, or a note. For contact, use the form on the homepage.',
    '',
    '## Case studies',
    '',
    ...caseStudies.map((study) => `- [${study.title}](${SITE_URL}/projects/${study.slug}): ${study.summary} (${study.status})`),
    '',
    '## Notes',
    '',
    ...published.map((note) => `- [${note.title}](${SITE_URL}/notes/${note.slug}): ${note.summary}`),
    '',
    '## About',
    '',
    `- [Homepage](${SITE_URL}/): skills, experience, and selected projects`,
    `- [Now](${SITE_URL}/now): current focus, updated ${roadmap.updatedAt}`,
    `- [CV (PDF)](${SITE_URL}/Rashay_Daya_CV.pdf)`,
    '- [GitHub](https://github.com/Rashay01)',
    '- [LinkedIn](https://za.linkedin.com/in/rashay-daya-795804262)',
    '',
  ].join('\n')
}
