import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { MenuElement } from '../../pages/MenuElement';
import { STANDARD_USER, LOCKED_USER } from '../../test-data/users';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let menuElement: MenuElement;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  menuElement = new MenuElement(page);
  await loginPage.goto();
});

test('standard_user logs in and logs out successfully', async ({ page }) => {
  await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);

  await inventoryPage.expectInventoryPageIsLoaded();

  // TODO: I would rather remove this assertion, because it is not needed
  // await expect(inventoryPage.inventoryItems.first()).toBeVisible(); 

  // NOTE: EXPECTED TO HAVE 2 ERRORS IN CONSOLE - WILL NOT BE FIXED
  // https://events.backtrace.io/api/summed-events/submit?universe=UNIVERSE&token=TOKEN
  // Status Code	 401 Unauthorized
  await menuElement.expectLogoutMenuItemIsVisible();

  await menuElement.clickLogoutAndReturnToIndexPage();
});

test('locked_out_user sees error message', async ({ page }) => {
  await loginPage.login(LOCKED_USER.username, LOCKED_USER.password);

  await loginPage.expectIncorrectCredentialsErrorMessage();
  await loginPage.expectNotLoggedIn(menuElement.logoutLink);
});
