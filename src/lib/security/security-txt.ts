// RFC 9116 security.txt. Reports go through GitHub private vulnerability
// reporting, so no email address is published here.
const REPO = 'https://github.com/Rashay01/rashaydaya-portfolio'

export function buildSecurityTxt(now = new Date()) {
  const expires = new Date(now)
  expires.setUTCFullYear(expires.getUTCFullYear() + 1)
  expires.setUTCDate(expires.getUTCDate() - 1)
  return [
    `Contact: ${REPO}/security/advisories/new`,
    `Policy: ${REPO}/security/policy`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    'Preferred-Languages: en',
    'Canonical: https://rashaydaya.co.za/.well-known/security.txt',
    '',
  ].join('\n')
}
