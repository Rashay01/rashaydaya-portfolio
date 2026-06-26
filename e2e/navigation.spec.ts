import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads with correct title containing "Rashay Daya"', async ({ page }) => {
    await expect(page).toHaveTitle(/Rashay Daya/i)
  })

  test('nav link Skills is visible', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    await expect(nav.getByRole('link', { name: /skills/i })).toBeVisible()
  })

  test('nav link Projects is visible', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    await expect(nav.getByRole('link', { name: /^projects$/i })).toBeVisible()
  })

  test('nav link Contact is visible', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible()
  })

  test('CV download link has correct href', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    const cvLink = nav.getByLabel('Download CV')
    await expect(cvLink).toBeVisible()
    await expect(cvLink).toHaveAttribute('href', '/Rashay_Daya_CV.pdf')
  })

  test('page has a main landmark', async ({ page }) => {
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })
})
