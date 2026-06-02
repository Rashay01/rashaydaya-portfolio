import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads with correct title containing "Rashay Daya"', async ({ page }) => {
    await expect(page).toHaveTitle(/Rashay Daya/i)
  })

  test('nav link Archive is visible', async ({ page }) => {
    const archiveLink = page.getByRole('link', { name: /archive/i })
    await expect(archiveLink).toBeVisible()
  })

  test('nav link Forge is visible', async ({ page }) => {
    const forgeLink = page.getByRole('link', { name: /forge/i })
    await expect(forgeLink).toBeVisible()
  })

  test('nav link Deploy is visible', async ({ page }) => {
    const deployLink = page.getByRole('link', { name: /deploy/i })
    await expect(deployLink).toBeVisible()
  })

  test('CV download link has correct href', async ({ page }) => {
    const cvLink = page.getByRole('link', { name: /download cv/i })
    await expect(cvLink).toBeVisible()
    await expect(cvLink).toHaveAttribute('href', '/Rashay_Daya_CV.pdf')
  })

  test('page has a main landmark', async ({ page }) => {
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })
})
