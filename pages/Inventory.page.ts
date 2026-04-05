import { type Locator, type Page, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.getByTestId('inventory-list');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.inventoryItems = page.getByTestId('inventory-item');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async isLoaded(): Promise<boolean> {
    await this.inventoryList.waitFor({ state: 'visible' });
    return await this.inventoryList.isVisible();
  }

  async addToCartByName(productName: string) {
    const item = this.inventoryItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async getItemPrice(productName: string): Promise<string> {
    const item = this.inventoryItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
    return await item.getByTestId('inventory-item-price').innerText();
  }

  async sortBy(value: string) {
    await this.sortDropdown.selectOption(value);
  }

  async getItemNames(): Promise<string[]> {
    return await this.page.getByTestId('inventory-item-name').allInnerTexts();
  }

  async expectInventoryPageIsLoaded() {
    await expect(this.page).toHaveURL(/.*\/inventory\.html$/, { timeout: 5000 });
  }
}
