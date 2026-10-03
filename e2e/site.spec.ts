import { expect, test, type Page } from '@playwright/test';

/** Desktop: globe button in the header. Phones/tablets: language list inside the menu. */
async function chooseLanguage(page: Page, isMobile: boolean, name: RegExp | string) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('#mobile-menu .menu-languages').getByRole('link', { name }).click();
  } else {
    await page.getByRole('button', { name: /Change language/ }).click();
    await page.locator('#language-menu').getByRole('link', { name }).click();
  }
}

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test('root redirects to the English home page; preview is not indexable', async ({ page }) => {
  const response = await page.goto('/');
  expect(page.url()).toMatch(/\/en$/);
  expect(response?.headers()['x-robots-tag']).toContain('noindex');
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your island stay. Your signature style.');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page).toHaveTitle(/Custom Tailoring in Koh Samui/);
});

test('header shows the approved SVG word mark undistorted, with alt text', async ({ page, isMobile }) => {
  await page.goto('/en');
  const logo = page.locator('header .logo-img');
  await expect(logo).toHaveAttribute('src', '/brand/NICKY_FASHION_WEB_TRIM.svg');
  await expect(logo).toHaveAttribute('alt', 'Nicky Fashion – Men’s & Women’s Wear – Tailoring by Mario K.');
  const box = (await logo.boundingBox())!;
  expect(box.width / box.height).toBeCloseTo(3238 / 789, 1);
  expect(box.width).toBeGreaterThanOrEqual(isMobile ? 255 : 315);
  // Logo lines are artwork: identical in every language
  await page.goto('/th');
  await expect(page.locator('header .logo-img')).toHaveAttribute('src', '/brand/NICKY_FASHION_WEB_TRIM.svg');
});

test('home page v2: hero actions, four style worlds, six looks, both stores', async ({ page }) => {
  await page.goto('/de');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Deine Inselzeit. Dein persönlicher Stil.');
  await expect(page.getByText('Chaweng · Fisherman’s Village · Koh Samui').first()).toBeVisible();
  await expect(page.locator('.world')).toHaveCount(4);
  await expect(page.locator('#looks .look-card')).toHaveCount(6);
  await page.getByRole('link', { name: 'Looks entdecken' }).click();
  await expect(page).toHaveURL(/#looks$/);
  await expect(page.getByRole('heading', { name: 'Chaweng', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fisherman’s Village', exact: true })).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/20 (Jahre|years)|since 20\d\d|Nicky Fashion Samui/i);
  await noHorizontalOverflow(page);
});

test('main navigation: Tailoring · Our Work · Mario & Team · Our Stores · Contact', async ({ page, isMobile }) => {
  await page.goto('/en');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = isMobile ? page.locator('#mobile-menu nav > ul') : page.locator('header .main-nav');
  await expect(nav.getByRole('link')).toHaveText(['Tailoring', 'Our Work', 'Mario & Team', 'Our Stores', 'Contact']);
});

test('language switch keeps the current page', async ({ page, isMobile }) => {
  await page.goto('/en/stores/chaweng');
  await chooseLanguage(page, !!isMobile, /Deutsch/);
  await expect(page).toHaveURL(/\/de\/stores\/chaweng$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Unser Geschäft in Chaweng');
  if (!isMobile) await noHorizontalOverflow(page);
});

test('language switch keeps the request context on the contact page', async ({ page, isMobile }) => {
  await page.goto('/en/contact?interest=weddings&store=fishermans-village');
  await chooseLanguage(page, !!isMobile, /Italiano/);
  await expect(page).toHaveURL(/\/it\/contact\?interest=weddings&store=fishermans-village$/);
  await expect(page.locator('#inq-interest')).toHaveValue('weddings');
  await expect(page.locator('#inq-store')).toHaveValue('fishermans-village');
});

test('footer language links also keep the current page', async ({ page }) => {
  await page.goto('/en/faq');
  await page.locator('.footer-langs').getByRole('link', { name: 'Français' }).click();
  await expect(page).toHaveURL(/\/fr\/faq$/);
});

test('all five languages render the store page', async ({ page }) => {
  for (const locale of ['en', 'de', 'th', 'fr', 'it']) {
    await page.goto(`/${locale}/stores/fishermans-village`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toContainText('Fisherman’s Village');
  }
});

test('unknown pages return a localised 404', async ({ page }) => {
  const res = await page.goto('/fr/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only');

  test('menu opens and closes with the keyboard and manages focus', async ({ page }) => {
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

  test('quick-contact bar sits at the visible bottom edge and does not cover the footer', async ({ page }) => {
    await page.goto('/en/faq');
    const vh = page.viewportSize()!.height;
    const bar = (await page.locator('.mobile-bar').boundingBox())!;
    expect(Math.round(bar.y + bar.height)).toBe(vh);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const meta = (await page.locator('.footer-meta').boundingBox())!;
    expect(meta.y + meta.height).toBeLessThanOrEqual(bar.y + 1);
  });

  test('quick-contact bar is hidden on the request pages', async ({ page }) => {
    for (const path of ['/en/contact', '/de/returning-customers']) {
      await page.goto(path);
      await expect(page.locator('.mobile-bar')).toHaveCount(0);
    }
  });

  test('quick bar steps aside while a form field is focused (on-screen keyboard)', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('.mobile-bar')).toBeVisible();
    await page.locator('#plan-arrival').focus();
    await expect(page.locator('.mobile-bar')).toBeHidden();
    await page.locator('#plan-arrival').blur();
    await expect(page.locator('.mobile-bar')).toBeVisible();
  });

  test('landscape phone (844 × 390): no overflow, bar at the bottom, form usable', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    for (const path of ['/en', '/de/contact', '/en/stores/chaweng']) {
      await page.goto(path);
      await noHorizontalOverflow(page);
    }
    await page.goto('/en/faq');
    const bar = (await page.locator('.mobile-bar').boundingBox())!;
    expect(Math.round(bar.y + bar.height)).toBe(390);
    expect(bar.height).toBeLessThan(90);
  });

  test('zoom / large text: 200 % text size keeps the layout without overflow', async ({ page }) => {
    for (const path of ['/en', '/en/contact', '/en/stores/chaweng', '/en/tailoring/men', '/en/our-work', '/th']) {
      await page.goto(path);
      await page.addStyleTag({ content: 'html{font-size:200%}' });
      await noHorizontalOverflow(page);
    }
  });

  test('hero image, statement and main action appear early', async ({ page }) => {
    await page.goto('/en');
    const vh = page.viewportSize()!.height;
    const cta = (await page.locator('.hero-v2 .btn').first().boundingBox())!;
    expect(cta.y + cta.height).toBeLessThan(vh * 1.1);
  });
});

test.describe('appointment request form (v2)', () => {
  async function fillContact(page: Page) {
    await page.locator('#inq-name').fill('Test Person');
    await page.locator('#inq-contactValue').fill('test@example.com');
  }

  test('three groups, one interest field, no duplicate required fields', async ({ page }) => {
    await page.goto('/en/contact');
    await expect(page.locator('.form-group legend')).toHaveText([/Your request/, /Your stay/, /Contact/]);
    await expect(page.locator('#inq-concern, #inq-product')).toHaveCount(0);
    await expect(page.locator('#inq-preferredDate')).toHaveCount(0);
    await page.getByRole('button', { name: /Suggest a consultation date/ }).click();
    await expect(page.locator('#inq-preferredDate')).toBeVisible();
  });

  test('shows field errors and keeps the input', async ({ page }) => {
    await page.goto('/en/contact');
    await page.locator('#inq-name').fill('Alex');
    await page.getByTestId('inquiry-submit').click();
    await expect(page.getByText('Please check the highlighted fields.')).toBeVisible();
    await expect(page.locator('#inq-interest')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#inq-contactValue')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#inq-name')).toHaveValue('Alex');
  });

  test('rejects departure before arrival and a past suggested date', async ({ page }) => {
    await page.goto('/de/contact');
    await page.locator('#inq-arrival').fill('2099-05-10');
    await page.locator('#inq-departure').fill('2099-05-01');
    await page.getByRole('button', { name: /Beratungstermin vorschlagen/ }).click();
    await page.locator('#inq-preferredDate').fill('2020-01-01');
    await page.getByTestId('inquiry-submit').click();
    await expect(page.locator('.field-error', { hasText: 'Die Abreise darf nicht vor der Anreise liegen.' })).toBeVisible();
    await expect(page.locator('.field-error', { hasText: 'Dieses Datum liegt in der Vergangenheit.' })).toBeVisible();
  });

  test('"dates still open" hides the dates and does not send them', async ({ page }) => {
    let sent: Record<string, unknown> = {};
    await page.route('**/api/inquiry', async (route) => {
      sent = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"outcome":"demo"}' });
    });
    await page.goto('/en/contact');
    await page.locator('#inq-interest').selectOption('unsure');
    await page.locator('#inq-arrival').fill('2099-05-10');
    await page.locator('#inq-departure').fill('2099-05-01');
    await page.getByTestId('dates-open').check();
    await expect(page.locator('#inq-arrival')).toHaveCount(0);
    await fillContact(page);
    await page.getByTestId('inquiry-submit').click();
    await expect(page.getByTestId('inquiry-status')).toHaveAttribute('data-outcome', 'demo');
    expect(sent).toMatchObject({ datesOpen: true, arrival: '', departure: '', interest: 'unsure' });
  });

  test('"Ask about this look" carries the look reference and interest; reference is removable', async ({ page }) => {
    await page.goto('/en');
    await page.locator('#looks .look-card[data-look="look-02"]').getByRole('link', { name: 'Ask about this look' }).click();
    await expect(page).toHaveURL(/\/en\/contact\?look=look-02$/);
    await expect(page.getByTestId('look-reference')).toContainText('look-02');
    await expect(page.locator('#inq-interest')).toHaveValue('linen-holiday');
    await page.getByRole('button', { name: 'Remove look' }).click();
    await expect(page.getByTestId('look-reference')).toHaveCount(0);
    await expect(page.getByTestId('inquiry-status')).toHaveCount(0); // context alone sends nothing
  });

  test('home "plan your stay" module continues in the full form without double entry', async ({ page }) => {
    await page.goto('/en');
    const plan = page.getByTestId('plan-stay');
    await plan.locator('#plan-interest').selectOption('women');
    await plan.locator('#plan-arrival').fill('2099-03-01');
    await plan.locator('#plan-departure').fill('2099-03-15');
    await plan.getByRole('button', { name: 'Continue to your request' }).click();
    await expect(page).toHaveURL(/\/en\/contact\?/);
    await expect(page.locator('#inq-interest')).toHaveValue('women');
    await expect(page.locator('#inq-arrival')).toHaveValue('2099-03-01');
    await expect(page.locator('#inq-departure')).toHaveValue('2099-03-15');
  });

  test('category and store links take over interest and store', async ({ page }) => {
    await page.goto('/en/tailoring/weddings');
    await page.getByRole('link', { name: /Request a consultation for Weddings/ }).click();
    await expect(page.locator('#inq-interest')).toHaveValue('weddings');
    await page.goto('/en/stores/chaweng');
    await page.getByRole('link', { name: /Request a consultation in Chaweng/ }).click();
    await expect(page.locator('#inq-store')).toHaveValue('chaweng');
  });

  test('demo mode is clearly labelled as a test that was not sent', async ({ page }) => {
    await page.goto('/en/contact');
    await page.locator('#inq-interest').selectOption('suits');
    await fillContact(page);
    await page.getByTestId('inquiry-submit').click();
    const status = page.getByTestId('inquiry-status');
    await expect(status).toHaveAttribute('data-outcome', 'demo');
    await expect(status).toContainText('Test request — not sent');
    await expect(status).not.toContainText('has been sent');
  });

  test('a delivery failure shows an error, keeps the input and allows retry', async ({ page }) => {
    await page.route('**/api/inquiry', (route) => route.fulfill({ status: 502, contentType: 'application/json', body: '{"ok":false,"error":"failed"}' }));
    await page.goto('/en/contact');
    await page.locator('#inq-interest').selectOption('suits');
    await fillContact(page);
    await page.getByTestId('inquiry-submit').click();
    await expect(page.getByTestId('inquiry-status')).toContainText('Your request could not be sent.');
    await expect(page.locator('#inq-name')).toHaveValue('Test Person');
    await expect(page.getByTestId('inquiry-submit')).toHaveText('Try again');
  });

  test('success only after the service accepted; no double submission', async ({ page }) => {
    let calls = 0;
    await page.route('**/api/inquiry', async (route) => {
      calls += 1;
      await new Promise((r) => setTimeout(r, 600));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"outcome":"accepted"}' });
    });
    await page.goto('/de/contact');
    await page.locator('#inq-interest').selectOption('suits');
    await fillContact(page);
    const submit = page.getByTestId('inquiry-submit');
    await submit.click();
    await expect(submit).toBeDisabled();
    await submit.click({ force: true }).catch(() => {});
    await expect(page.getByTestId('inquiry-status')).toHaveAttribute('data-outcome', 'accepted');
    await expect(page.getByTestId('inquiry-status')).toContainText('Deine Anfrage wurde gesendet.');
    await expect(page.getByTestId('inquiry-status')).toContainText('Unser Team meldet sich, um einen passenden Termin zu vereinbaren.');
    expect(calls).toBe(1);
  });
});

test('Our Work: filter by style and an accessible look dialog with focus return', async ({ page }) => {
  await page.goto('/en/our-work');
  await expect(page.locator('.look-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Women', exact: true }).click();
  await expect(page.locator('.look-card')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Women', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const opener = page.getByRole('button', { name: /View look: Look slot 3/ });
  await opener.click();
  const dialog = page.locator('dialog.look-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Ask about this look' })).toHaveAttribute('href', '/en/contact?look=look-03');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('WhatsApp is visibly disabled while no number is confirmed', async ({ page }) => {
  await page.goto('/en/stores/chaweng');
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(page.getByText('WhatsApp number not yet confirmed').first()).toBeVisible();
});

test.describe('widths 360–1440: no horizontal overflow', () => {
  test.skip(({ isMobile }) => isMobile, 'runs once on the desktop project');
  for (const width of [320, 360, 375, 390, 430, 768, 1440]) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['/en', '/th', '/de/contact', '/en/stores/fishermans-village', '/fr/our-work']) {
        await page.goto(path);
        await noHorizontalOverflow(page);
        const logo = (await page.locator('header .logo-img').boundingBox())!;
        expect(logo.width).toBeGreaterThanOrEqual(220);
      }
    });
  }
});
