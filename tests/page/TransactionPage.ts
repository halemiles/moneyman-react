import { Page, Locator } from '@playwright/test';

export default class TransactionPage {
    readonly page: Page;
    readonly transactionName: Locator;
    readonly transactionAmount: Locator;
    readonly transactionDueDate: Locator;

  constructor(page) {
    this.page = page;
    this.transactionName = page.locator('#formTransactionName');
    this.transactionAmount = page.locator('#formTransactionAmount');
    this.transactionDueDate = page.locator('#formTransactionDate');
  }

  async goto(transactionName: string) {
    await this.page.goto('/');
    await this.page.getByRole('link', {name: 'Transactions'}).click();


    if(transactionName){
        // find the row with the same transaction name. click the button called edit
        const rows = this.page.locator('.transaction-row');
        for(const row of rows){
            const nameCell = row.locator('td:nth-of-type(1)');
            if(await nameCell.textContent() === transactionName){
                const editButton = row.locator('button', {name: 'Edit'});
                await editButton.click();
                break;
            }
        }
    }
    else {
      await this.page.getByRole('button', {name: 'Add Transaction'}).click();
    }
  }

  async fillForm(data) {
    await this.transactionName.fill(data.transactionName);
    await this.transactionAmount.fill(data.transactionAmount);
    await this.transactionDueDate.fill(data.transactionDueDate);
  }

  async submitTransaction() {
    //await this.page.click('[value="Submit"]');
    await this.page.getByRole('button', {name:'Create Transaction'});
  }
}
