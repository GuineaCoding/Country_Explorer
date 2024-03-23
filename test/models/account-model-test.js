import { expect } from "chai";
import database from "../../firebaseConfig.js";
import { accountsModel } from "../../src/models/accounts-model.js"; 

// Test suite for Accounts Model
describe("Accounts Model Tests", () => {

  // Test data for a user
  const testUser = {
    email: "testuser@example.com",
    name: "Test User",
    role: "user",
    firstName: "test user",
    lastName: "test user",
    password: "2",
  };

  // Updated user data
  const updatedUser = {
    email: "testuser@example.com",
    name: "Test User",
    role: "user",
    firstName: "test user",
    lastName: "test user",
    password: "2",
  };

  // Test case: createUser
  describe("createUser", () => {
    // Test for creating a new user
    it("should create a new user", async () => {
      // Creating a new user
      await accountsModel.createUser(testUser);
      // Retrieving the created user
      const retrievedUser = await accountsModel.getUserByEmail(testUser.email);
      // Assertion: Check if the retrieved user matches the test user data
      expect(retrievedUser).to.include(testUser);
    });
  });

  // Test case: getUserByEmail
  describe("getUserByEmail", () => {
    // Test for retrieving a user by email
    it("should retrieve a user by email", async () => {
      // Retrieving a user by email
      const retrievedUser = await accountsModel.getUserByEmail(testUser.email);
      // Assertion: Check if the retrieved user matches the test user data
      expect(retrievedUser).to.include(testUser);
    });
  });

  // Test case: updateUser
  describe("updateUser", () => {
    // Test for updating user details
    it("should update user details", async () => {
      // Updating user details
      await accountsModel.updateUser(testUser.email, updatedUser);
      // Retrieving the updated user
      const retrievedUser = await accountsModel.getUserByEmail(updatedUser.email);
      // Assertion: Check if the user's name is updated as expected
      expect(retrievedUser.name).to.equal(updatedUser.name);
    });
  });

  // Clean up after tests
  after(async () => {
    // Removing test users from the database
    await database.ref(`users/${testUser.email.replace(/\./g, ",")}`).remove();
    await database.ref(`users/${updatedUser.email.replace(/\./g, ",")}`).remove();
  });
});
