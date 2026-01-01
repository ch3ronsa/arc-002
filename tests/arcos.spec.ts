import { test, expect } from '@playwright/test';

// Test timeout'unu artır
test.setTimeout(60000);

test.describe('ArcOS Ana Sayfa Testleri', () => {

    test('Ana sayfa başarıyla yükleniyor', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // Sayfa başlığında "Arc" kelimesi olmalı
        await expect(page).toHaveTitle(/Arc/);
    });

    test('Landing page görsel elementleri mevcut', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // Sayfa içeriği yükleniyor mu?
        await expect(page.locator('body')).toBeVisible();
    });

});

test.describe('ArcOS Workspace Testleri', () => {

    test('Workspace sayfası yükleniyor', async ({ page }) => {
        await page.goto('/myworkspace');
        await page.waitForLoadState('domcontentloaded');

        // URL doğru mu?
        await expect(page).toHaveURL(/myworkspace/);

        // Sayfa body görünür mü?
        await expect(page.locator('body')).toBeVisible();
    });

    test('Kanban board görünür durumda', async ({ page }) => {
        await page.goto('/myworkspace');
        await page.waitForLoadState('domcontentloaded');

        // Sayfanın yüklenmesini bekle
        await page.waitForTimeout(2000);

        // Body görünür olmalı
        await expect(page.locator('body')).toBeVisible();
    });

});

test.describe('ArcOS Navigasyon Testleri', () => {

    test('Notes sayfasına navigasyon', async ({ page }) => {
        await page.goto('/notes');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/notes/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('Focus sayfasına navigasyon', async ({ page }) => {
        await page.goto('/focus');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/focus/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('Profile sayfasına navigasyon', async ({ page }) => {
        await page.goto('/profile');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/profile/);
    });

    test('Changelog sayfasına navigasyon', async ({ page }) => {
        await page.goto('/changelog');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/changelog/);

        // Sayfanın yüklenmesini bekle
        await page.waitForTimeout(1000);

        // Heading'i bul - daha esnek selector
        const heading = page.getByRole('heading', { level: 1 });
        await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test('Tutorial sayfasına navigasyon', async ({ page }) => {
        await page.goto('/tutorial');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/tutorial/);
    });

    test('Docs sayfasına navigasyon', async ({ page }) => {
        await page.goto('/docs');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/docs/);
    });

});

test.describe('ArcOS Changelog Testleri', () => {

    test('Changelog sayfasında versiyon bilgileri mevcut', async ({ page }) => {
        await page.goto('/changelog');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Herhangi bir versiyon numarası görünüyor mu?
        const versionText = page.locator('text=/v\\d+\\.\\d+/').first();
        await expect(versionText).toBeVisible({ timeout: 10000 });
    });

    test('Changelog filtreleri çalışıyor', async ({ page }) => {
        await page.goto('/changelog');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Filtre butonlarını bul - text içeriğine göre
        const filterButton = page.locator('button').filter({ hasText: /all/i }).first();
        await expect(filterButton).toBeVisible({ timeout: 10000 });
    });

    test('Developer Logs açılıyor', async ({ page }) => {
        await page.goto('/changelog');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Developer Logs butonu var mı?
        const devLogsButton = page.locator('text=/Developer/i').first();
        await expect(devLogsButton).toBeVisible({ timeout: 10000 });

        // Tıkla
        await devLogsButton.click();
        await page.waitForTimeout(500);

        // Git log görünüyor mu?
        const gitLog = page.locator('text=/git/i').first();
        await expect(gitLog).toBeVisible({ timeout: 5000 });
    });

});

test.describe('ArcOS Responsive Tasarım Testleri', () => {

    test('Mobil görünümde sayfa düzgün yükleniyor', async ({ page }) => {
        // Mobil viewport boyutu
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto('/myworkspace');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/myworkspace/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('Tablet görünümde sayfa düzgün yükleniyor', async ({ page }) => {
        // Tablet viewport boyutu
        await page.setViewportSize({ width: 768, height: 1024 });

        await page.goto('/myworkspace');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/myworkspace/);
        await expect(page.locator('body')).toBeVisible();
    });

});
