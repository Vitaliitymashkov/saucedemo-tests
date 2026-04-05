import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/Login.page';
import { InventoryPage } from '../../pages/Inventory.page';
import { CartPage } from '../../pages/Cart.page';
import { CheckoutPage } from '../../pages/Checkout.page';
import { STANDARD_USER } from '../../test-data/users';
import { BACKPACK, BACKPACK_TAX, BACKPACK_TOTAL } from '../../test-data/products';
import { CHECKOUT_MESSAGES, checkoutDetails } from '../../test-data/checkout';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  await loginPage.goto();
  await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);

});

test('Complete purchase journey with checkout and price verifications', async ({ page }) => {
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await test.step('Step 1: Verify backpack price on inventory page', async () => {
    const inventoryPrice = await inventoryPage.getItemPrice(BACKPACK.name);
    expect(inventoryPrice).toBe(BACKPACK.price);
  });

  await test.step('Step 2: Add backpack to cart', async () => {
    await inventoryPage.addToCartByName(BACKPACK.name);
  });

  await test.step('Step 3: Go to cart page', async () => {
    await cartPage.goto();
  });

  await test.step(`Step 4: Verify cart contains exactly 1 item named "${BACKPACK.name}"`, async () => {
    await expect(cartPage.cartItems).toHaveCount(1);
    const cartItemNames = await cartPage.getItemNames();
    expect(cartItemNames).toEqual([BACKPACK.name]);
  })

  await test.step('Step 5: Verify cart item price', async () => {
    const cartPrice = await cartPage.getItemPrice(BACKPACK.name);
    expect(cartPrice).toBe(BACKPACK.price);
  });

  await test.step('Step 6: Go to checkout page', async () => {
    await cartPage.goToCheckoutPage();
  });

  await test.step('Step 7: Fill checkout info', async () => {
    await checkoutPage.fillCheckoutInfo(checkoutDetails);
  });

  await test.step('Step 8: Verify checkout overview totals', async () => {
    await expect(checkoutPage.subtotalLabel).toContainText(BACKPACK.price);
    await expect(checkoutPage.taxLabel).toContainText(BACKPACK_TAX.toFixed(2));
    await expect(checkoutPage.totalPriceLabel).toContainText(BACKPACK_TOTAL.toFixed(2));
  });

  await test.step('Step 9: Click Finish', async () => {
    await checkoutPage.finish();
  });

  await test.step('Step 10: Verify completion message', async () => {
    await expect(checkoutPage.completeHeader).toHaveText(CHECKOUT_MESSAGES.completeHeader);
  });
});
