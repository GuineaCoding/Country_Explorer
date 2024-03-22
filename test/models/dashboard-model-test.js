import { expect } from "chai";
import database from "../../firebaseConfig.js";
import { dashboardModel } from "../../src/models/dashboard-model.js";

// Test suite for Dashboard Model
describe("Dashboard Model Tests", () => {
  const userEmail = "testuser@example,com"; // User email for testing
  const testCategory = {
    name: "Test Category"
  };
  let categoryId; // Variable to store the ID of the added category

  // Test case: getUserLandmarkCategories
  describe("getUserLandmarkCategories", () => {
    // Test for retrieving user landmark categories
    it("should retrieve user landmark categories", async () => {
      const categories = await dashboardModel.getUserLandmarkCategories(userEmail);
      expect(categories).to.be.an("array");
    });
  });

  // Test case: addLandmarkCategory
  describe("addLandmarkCategory", () => {
    // Test for adding a new landmark category
    it("should add a new landmark category", async () => {
      await dashboardModel.addLandmarkCategory(userEmail, testCategory);
      const categories = await dashboardModel.getUserLandmarkCategories(userEmail);
      const addedCategory = categories.find(category => category.name === testCategory.name);
      expect(addedCategory).to.not.equal(undefined);
      categoryId = addedCategory._id;
    });
  });

  // Test case: deleteLandmarkCategory
  describe("deleteLandmarkCategory", () => {
    it("should delete a landmark category", async () => {
      await dashboardModel.deleteLandmarkCategory(userEmail, categoryId);
      const categories = await dashboardModel.getUserLandmarkCategories(userEmail);
      const deletedCategory = categories.find(category => category._id === categoryId);
      expect(deletedCategory).to.not.equal(undefined);
    });
  });
});
