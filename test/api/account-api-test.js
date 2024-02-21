import { assert } from "chai";
import { accountService } from "./accountService.js";
import { assertSubset } from "../test-utils.js"; 
import { exampleAccount } from "../fixtures.js"; 

suite("Account API tests", () => {
  test("create an account", async () => {
    const newAccount = await accountService.createAccount(exampleAccount);
    assertSubset(exampleAccount, newAccount);
  });

  test("find accounts", async () => {
    const accounts = await accountService.findAccounts();
    assert.isArray(accounts); 
  });

});
