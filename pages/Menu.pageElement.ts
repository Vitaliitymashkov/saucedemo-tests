import { expect, Locator, Page } from '@playwright/test';

export class MenuElement {
  readonly page: Page;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async openMenu(): Promise<void> {
    await this.burgerMenuButton.click();
  }

  async clickLogoutMenuItem(): Promise<void> {
    await this.logoutLink.click();
  }

  async expectLogoutMenuItemIsVisible() {
    await this.openMenu();
    await expect(this.logoutLink).toBeVisible();
    await expect(this.logoutLink).not.toHaveAttribute('tabindex', '-1');
  }

  async clickLogoutAndReturnToIndexPage() {
    await this.clickLogoutMenuItem();
    await expect(this.page).toHaveURL('/', { timeout: 5000 });
  }
}
