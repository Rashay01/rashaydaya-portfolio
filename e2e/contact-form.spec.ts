import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // Helper: open the contact dialog by finding a "GET IN TOUCH" or contact trigger
  async function openContactDialog(page: any) {
    // Try the hero section "GET IN TOUCH →" button first (visible on all screen sizes)
    const heroTrigger = page.getByRole('button', { name: /get in touch/i }).first()
    await heroTrigger.click()
    // Wait for the dialog to appear
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })
  }

  test('contact form can be opened via GET IN TOUCH button', async ({ page }) => {
    await openContactDialog(page)
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('contact dialog has a heading', async ({ page }) => {
    await openContactDialog(page)
    // The dialog h2 heading is "Start the conversation."
    await expect(page.getByRole('heading', { name: /start the conversation/i })).toBeVisible()
  })

  test('form shows validation errors when submitted empty', async ({ page }) => {
    await openContactDialog(page)

    // Click submit without filling anything
    const submitBtn = page.getByRole('button', { name: /transmit/i })
    await submitBtn.click()

    // At least one error should appear (name is required)
    const alerts = page.getByRole('alert')
    await expect(alerts.first()).toBeVisible({ timeout: 3000 })
  })

  test('name field accepts typed input', async ({ page }) => {
    await openContactDialog(page)
    const nameInput = page.getByLabel(/name/i)
    await nameInput.fill('Alice')
    await expect(nameInput).toHaveValue('Alice')
  })

  test('email field accepts typed input', async ({ page }) => {
    await openContactDialog(page)
    const emailInput = page.getByLabel(/email/i)
    await emailInput.fill('alice@example.com')
    await expect(emailInput).toHaveValue('alice@example.com')
  })

  test('message field accepts typed input', async ({ page }) => {
    await openContactDialog(page)
    const messageInput = page.getByLabel(/message/i)
    await messageInput.fill('Hello, this is a test message.')
    await expect(messageInput).toHaveValue('Hello, this is a test message.')
  })

  test('dialog can be closed with the close button', async ({ page }) => {
    await openContactDialog(page)
    const closeBtn = page.getByLabel(/close contact form/i)
    await expect(closeBtn).toBeVisible()
    await closeBtn.click()
    // AnimatePresence runs a 0.2s exit animation before removing the node —
    // toBeHidden() retries until opacity reaches 0 or the element is detached
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 8000 })
  })

  test('dialog can be closed with the Escape key', async ({ page }) => {
    await openContactDialog(page)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 8000 })
  })
})
