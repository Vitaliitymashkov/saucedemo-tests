import { type Locator, type Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getItemNames(): Promise<string[]> {
    return await this.page.getByTestId('inventory-item-name').allInnerTexts();
  }

  async getItemPrice(name: string): Promise<string> {
    const item = this.cartItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }),
    });
    return await item.getByTestId('inventory-item-price').innerText();
  }

  async goToCheckoutPage() {
    await this.checkoutButton.click();
  }

  async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }
}
