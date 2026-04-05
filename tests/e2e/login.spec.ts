import { test } from '@playwright/test';
import { LoginPage } from '../../pages/Login.page';
import { InventoryPage } from '../../pages/Inventory.page';
import { MenuElement } from '../../pages/Menu.pageElement';
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
  await test.step('Step 1: Enter credentials of active user', async () => {
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
  });

  await test.step('Step 2: Verify inventory page is loaded', async () => {
    await inventoryPage.expectInventoryPageIsLoaded();
  });

  // NOTE: HERE IT IS EXPECTED TO HAVE 2 ERRORS IN CONSOLE - WILL NOT BE FIXED
  // https://events.backtrace.io/api/summed-events/submit?universe=UNIVERSE&token=TOKEN
  // Status Code	 401 Unauthorized
  await test.step('Step 3: Verify logout menu item is visible', async () => {
    await menuElement.expectLogoutMenuItemIsVisible();
  });

  await test.step('Step 4: Verify backtrace guid is set', async () => {
    await loginPage.expectToHaveRandomBacktraceGuid();
  });

  await test.step('Step 5: Verify session username cookie is properly set', async () => {
    await loginPage.expectToHaveRelevantSessionUsernameCookie();
  });

  await test.step('Step 6: Click logout and return to index page', async () => {
    await menuElement.clickLogoutAndReturnToIndexPage();
  });
});

test('locked_out_user sees error message', async ({ page }) => {
  await test.step('Step 1: Enter credentials of locked out user', async () => {
    await loginPage.login(LOCKED_USER.username, LOCKED_USER.password);
  });

  await test.step('Step 2: Verify there is an expected error message', async () => {
    await loginPage.expectIncorrectCredentialsErrorMessage();
  });

  await test.step('Step 3: Verify it is not possible to log out', async () => {
    await loginPage.expectNotLoggedIn(menuElement.logoutLink);
  });
});
