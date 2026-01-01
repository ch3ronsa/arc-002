import { test, expect } from '@playwright/test';

test('Ana sayfa başarıyla yükleniyor mu?', async ({ page }) => {
    // 1. Siteye git (localhost'ta çalışıyorsan orayı yaz)
    await page.goto('http://localhost:3000');

    // 2. Sayfa başlığında "Arc" kelimesi geçiyor mu kontrol et
    await expect(page).toHaveTitle(/Arc/);
});
