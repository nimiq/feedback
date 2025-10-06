import { expect, test } from '@playwright/test'

test.describe('Feedback Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test')
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    // Open the feedback modal - click the first button (floating feedback button)
    await page.locator('button').first().click()
    // Wait for widget to mount
    await page.waitForSelector('#feedback-widget', { state: 'visible', timeout: 10000 })
  })

  test('submit bug report form', async ({ page }) => {
    // Click on the bug report button
    await page.click('button:has-text("Bug report")')

    // Fill in the description
    const description = 'The application crashes when clicking the save button'
    await page.fill('textarea[name="description"]', description)

    // Accept terms
    await page.check('input[name="acceptTerms"]')

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success message
    await page.waitForSelector('text=Thank you for your feedback!', { timeout: 10000 })

    // Verify success message is displayed
    const successMessage = await page.textContent('h2')
    expect(successMessage).toContain('Thank you for your feedback!')
  })

  test('submit idea form', async ({ page }) => {
    // Click on the idea button
    await page.click('button:has-text("Idea")')

    // Fill in the description
    const description = 'Add dark mode support to improve user experience'
    await page.fill('textarea[name="description"]', description)

    // Accept terms
    await page.check('input[name="acceptTerms"]')

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success message
    await page.waitForSelector('text=Thank you for your feedback!', { timeout: 10000 })

    // Verify success message is displayed
    const successMessage = await page.textContent('h2')
    expect(successMessage).toContain('Thank you for your feedback!')
  })

  test('submit feedback form', async ({ page }) => {
    // Click on the feedback button
    await page.click('button:has-text("Feedback")')

    // Fill in the description
    const description = 'Great product! Very intuitive and easy to use.'
    await page.fill('textarea[name="description"]', description)

    // Select rating (click on 5th star label)
    await page.click('label[for="rating-5"]')

    // Accept terms
    await page.check('input[name="acceptTerms"]')

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success message
    await page.waitForSelector('text=Thank you for your feedback!', { timeout: 10000 })

    // Verify success message is displayed
    const successMessage = await page.textContent('h2')
    expect(successMessage).toContain('Thank you for your feedback!')
  })
})
