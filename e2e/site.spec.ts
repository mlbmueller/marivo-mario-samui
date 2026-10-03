import { expect, test, type Page } from '@playwright/test';

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test('root redirects to the English home page; preview is not indexable', async ({ page }) => {
  const response = await page.goto('/');
  expect(page.url()).toMatch(/\/en$/);
  expect(response?.headers()['x-robots-tag']).toContain('noindex');
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Custom Tailoring in Koh Samui');
  await expect(page.locator('h1')).toHaveCount(1);
});

test('home page shows both stores and the locations line, no anniversary claim', async ({ page }) => {
  await page.goto('/de');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Masskleidung auf Koh Samui');
  await expect(page.getByText('Chaweng · Fisherman’s Village').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chaweng', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fisherman’s Village', exact: true })).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/20 (Jahre|years)|since 20\d\d/i);
  await noHorizontalOverflow(page);
});

test('language switch keeps the current page', async ({ page, isMobile }) => {
  await page.goto('/en/stores/chaweng');
  await page.getByRole('button', { name: /Change language/ }).click();
  await page.locator('#language-menu').getByRole('link', { name: /Deutsch/ }).click();
  await expect(page).toHaveURL(/\/de\/stores\/chaweng$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Unser Geschäft in Chaweng');
  if (!isMobile) await noHorizontalOverflow(page);
});

test('language switch keeps the product preselection on the contact page', async ({ page }) => {
  await page.goto('/en/contact?product=weddings&store=fishermans-village');
  await page.getByRole('button', { name: /Change language/ }).click();
  await page.locator('#language-menu').getByRole('link', { name: /Italiano/ }).click();
  await expect(page).toHaveURL(/\/it\/contact\?product=weddings&store=fishermans-village$/);
  await expect(page.locator('#inq-product')).toHaveValue('weddings');
  await expect(page.locator('#inq-store')).toHaveValue('fishermans-village');
});

test('footer language links also keep the current page', async ({ page }) => {
  await page.goto('/en/faq');
  await page.locator('.footer-langs').getByRole('link', { name: 'Français' }).click();
  await expect(page).toHaveURL(/\/fr\/faq$/);
});

test('all five languages render the store page', async ({ page }) => {
  for (const [locale, lang] of [['en', 'en'], ['de', 'de'], ['th', 'th'], ['fr', 'fr'], ['it', 'it']]) {
    await page.goto(`/${locale}/stores/fishermans-village`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang!);
    await expect(page.locator('h1')).toContainText('Fisherman’s Village');
  }
});

test('unknown pages return a localised 404', async ({ page }) => {
  const res = await page.goto('/fr/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
});

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only');

  test('opens and closes with the keyboard and manages focus', async ({ page }) => {
    await page.goto('/en');
    const button = page.getByRole('button', { name: 'Open menu' });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  });

  test('quick-contact bar does not cover the footer', async ({ page }) => {
    await page.goto('/en/contact');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const bar = await page.locator('.mobile-bar').boundingBox();
    const meta = await page.locator('.footer-meta').boundingBox();
    expect(bar && meta).toBeTruthy();
    expect(meta!.y + meta!.height).toBeLessThanOrEqual(bar!.y + 1);
    await noHorizontalOverflow(page);
  });
});

test.describe('appointment request form', () => {
  test('shows field errors and keeps the input', async ({ page }) => {
    await page.goto('/en/contact');
    await page.locator('#inq-name').fill('Alex');
    await page.getByTestId('inquiry-submit').click();
    await expect(page.getByText('Please check the highlighted fields.')).toBeVisible();
    await expect(page.locator('#inq-contactValue')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#inq-name')).toHaveValue('Alex');
  });

  test('rejects departure before arrival and a past preferred date', async ({ page }) => {
    await page.goto('/de/contact');
    await page.locator('#inq-arrival').fill('2099-05-10');
    await page.locator('#inq-departure').fill('2099-05-01');
    await page.locator('#inq-preferredDate').fill('2020-01-01');
    await page.getByTestId('inquiry-submit').click();
    await expect(page.locator('.field-error', { hasText: 'Die Abreise darf nicht vor der Anreise liegen.' })).toBeVisible();
    await expect(page.locator('.field-error', { hasText: 'Dieses Datum liegt in der Vergangenheit.' })).toBeVisible();
  });

  test('takes over product and store from a store / category link', async ({ page }) => {
    await page.goto('/en/tailoring/weddings');
    await page.getByRole('link', { name: /Request a consultation for Weddings/ }).click();
    await expect(page.locator('#inq-product')).toHaveValue('weddings');
    await expect(page.locator('#inq-concern')).toHaveValue('wedding');
    await page.goto('/en/stores/chaweng');
    await page.getByRole('link', { name: /Request a consultation in Chaweng/ }).click();
    await expect(page.locator('#inq-store')).toHaveValue('chaweng');
  });

  async function fillValid(page: Page) {
    await page.locator('#inq-name').fill('Test Person');
    await page.locator('#inq-contactValue').fill('test@example.com');
    await page.locator('#inq-concern').selectOption('consultation');
  }

  test('demo mode is clearly labelled as a test that was not sent', async ({ page }) => {
    await page.goto('/en/contact');
    await fillValid(page);
    await page.getByTestId('inquiry-submit').click();
    const status = page.getByTestId('inquiry-status');
    await expect(status).toHaveAttribute('data-outcome', 'demo');
    await expect(status).toContainText('Test request — not sent');
    await expect(status).not.toContainText('Thank you');
  });

  test('a delivery failure shows an error, keeps the input and allows retry', async ({ page }) => {
    await page.route('**/api/inquiry', (route) => route.fulfill({ status: 502, contentType: 'application/json', body: '{"ok":false,"error":"failed"}' }));
    await page.goto('/en/contact');
    await fillValid(page);
    await page.getByTestId('inquiry-submit').click();
    await expect(page.getByTestId('inquiry-status')).toContainText('Your request could not be sent.');
    await expect(page.locator('#inq-name')).toHaveValue('Test Person');
    await expect(page.getByTestId('inquiry-submit')).toHaveText('Try again');
  });

  test('success is shown only when the service accepted the request; no double submission', async ({ page }) => {
    let calls = 0;
    await page.route('**/api/inquiry', async (route) => {
      calls += 1;
      await new Promise((r) => setTimeout(r, 600));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"outcome":"accepted"}' });
    });
    await page.goto('/en/contact');
    await fillValid(page);
    const submit = page.getByTestId('inquiry-submit');
    await submit.click();
    await expect(submit).toBeDisabled();
    await expect(submit).toHaveText('Sending…');
    await submit.click({ force: true }).catch(() => {});
    await expect(page.getByTestId('inquiry-status')).toHaveAttribute('data-outcome', 'accepted');
    await expect(page.getByTestId('inquiry-status')).toContainText('This is not yet a confirmed appointment.');
    expect(calls).toBe(1);
  });
});

test('WhatsApp is visibly disabled while no number is confirmed', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(page.getByText('WhatsApp number not yet confirmed').first()).toBeVisible();
});
