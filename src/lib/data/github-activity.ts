export type CommitActivity = {
  sha: string
  message: string
  date: string
  htmlUrl: string
}

const REPO = 'Rashay01/rashaydaya-portfolio'

export async function getRecentActivity(): Promise<CommitActivity[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/commits?per_page=5`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []

    const commits = await res.json()
    return commits.map((c: { sha: string; commit: { message: string; author: { date: string } }; html_url: string }) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0],
      date: c.commit.author.date,
      htmlUrl: c.html_url,
    }))
  } catch {
    return []
  }
}
