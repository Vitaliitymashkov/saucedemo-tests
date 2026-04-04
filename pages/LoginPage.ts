import test, { type Locator, type Page, expect } from '@playwright/test';
import { ERROR_MESSAGE } from '../test-data/loginPage';
import { MenuElement } from './MenuElement';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);

    await test.step('Fill password (hidden)', async () => {
      await this.passwordInput.fill(password);
    });
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.innerText();
  }

  async expectIncorrectCredentialsErrorMessage() {
    await expect(this.errorMessage).toHaveText(ERROR_MESSAGE.text);
  }

  async expectNotLoggedIn(logoutLink: Locator) {
    await expect(this.page).not.toHaveURL(/.*\/inventory\.html$/, { timeout: 5000 });
    await expect(logoutLink).not.toBeVisible();
  }
}
