import test, { type Locator, type Page, expect } from '@playwright/test';
import { ERROR_MESSAGE } from '../test-data/loginPage';
import { STANDARD_USER } from '../test-data/users';
import { BACKTRACE_GUID_STORAGE_KEY, SESSION_USERNAME_COOKIE_NAME } from './UtilityConstants';

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

    // NOTE: Complete hiding secrets in Playwright is not possible,
    // so we use test.step to hide it in the report's upper level
    // Thought, in the inner level it is still visible
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

  async expectToHaveRandomBacktraceGuid() {
    const backtraceGuid = await this.page.evaluate((key) => localStorage.getItem(key), BACKTRACE_GUID_STORAGE_KEY);
    expect(backtraceGuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    console.log(`Backtrace GUID: ${backtraceGuid}`);
  }

  async expectToHaveRelevantSessionUsernameCookie() {
    const cookies = await this.page.context().cookies();
    expect(cookies.find((c) => c.name === SESSION_USERNAME_COOKIE_NAME)?.value).toBe(STANDARD_USER.username);
  }
}
