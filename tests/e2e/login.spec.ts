import { test } from '@playwright/test';
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

// NOTE: I propose removing assertion on InventoryList,
// as it is not a part of a login functionality
// REMOVED: await expect(inventoryPage.inventoryItems.first()).toBeVisible(); 
// 
// Instead, I propose looking if:
// 1) session cookie is set and username is similar to the one used for login,
// 2) backtrace guid is set in the proper format, 
// 3) logout menu item is visible and operational
test('standard_user logs in and logs out successfully', async ({ page }) => {
  await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);

  await inventoryPage.expectInventoryPageIsLoaded();

  // NOTE: HERE IT IS EXPECTED TO HAVE 2 ERRORS IN CONSOLE - WILL NOT BE FIXED
  // https://events.backtrace.io/api/summed-events/submit?universe=UNIVERSE&token=TOKEN
  // Status Code	 401 Unauthorized
  await menuElement.expectLogoutMenuItemIsVisible();

  await loginPage.expectToHaveRandomBacktraceGuid();

  await loginPage.expectToHaveRelevantSessionUsernameCookie();

  await menuElement.clickLogoutAndReturnToIndexPage();
});

test('locked_out_user sees error message', async ({ page }) => {
  await test.step('Step 1: Enter credentials of locked out user', async () => {
    await loginPage.login(LOCKED_USER.username, LOCKED_USER.password);
  });

  await test.step('Step 2: Verify error message', async () => {
    await loginPage.expectIncorrectCredentialsErrorMessage();
  });

  await test.step('Step 3: Verify not logged in', async () => {
    await loginPage.expectNotLoggedIn(menuElement.logoutLink);
  });
});
