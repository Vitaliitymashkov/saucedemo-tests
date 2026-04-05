import { type Locator, type Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly totalLabel: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalPriceLabel: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.totalLabel = page.getByTestId('total-info-value');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalPriceLabel = page.getByTestId('total-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillCheckoutInfo(checkoutDetails: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstNameInput.fill(checkoutDetails.firstName);
    await this.lastNameInput.fill(checkoutDetails.lastName);
    await this.postalCodeInput.fill(checkoutDetails.postalCode);
    await this.continueButton.click();
  }

  async getTotal(): Promise<string> {
    return await this.totalLabel.innerText();
  }

  async finish() {
    await this.finishButton.click();
  }
}
