import { expect } from "chai";
import { getDatabase, ref, remove } from "firebase/database";
import { landmarkModel } from "../../src/models/landmark-model.js";
import { dashboardModel } from "../../src/models/dashboard-model.js";

const userEmail = "testuser@example,com"; // User email for testing
const testCategory = { name: "TestCategory" };
let categoryId; 

// Dashboard Model Tests
describe("Dashboard Model Tests", () => {

  // Test case: Add Landmark Category (Dashboard Model)
  describe("Add Landmark Category", () => {
    it("should add a new landmark category", async () => {
      await dashboardModel.addLandmarkCategory(userEmail, testCategory);
      const categories = await dashboardModel.getUserLandmarkCategories(userEmail);
      const addedCategory = categories.find(category => category.name === testCategory.name);
      expect(addedCategory).to.not.equal(undefined);
      categoryId = addedCategory._id;
    });
  });

  // Additional tests for Landmark Model
  const testLandmarkId = "testLandmark";
  const testLandmark = { landmarkTitle: "Test Landmark", description: "A test landmark" };
  const updatedLandmark = { landmarkTitle: "Updated Test Landmark", description: "Updated description" };

  describe("Landmark Model Operations", () => {
    let landmarkId; // Variable to store the actual landmark ID
  
    it("should add, retrieve, update, and delete a landmark", async () => {
      // Add Landmark
      landmarkId = await landmarkModel.addLandmark(userEmail, categoryId, testLandmark);
  
      // Get Landmark
      const addedLandmark = await landmarkModel.getLandmark(userEmail, categoryId, landmarkId);
      expect(addedLandmark).to.not.be.null;
      expect(addedLandmark.landmarkTitle).to.equal(testLandmark.landmarkTitle);
  
      // Update Landmark
      await landmarkModel.updateLandmark(userEmail, categoryId, landmarkId, updatedLandmark);
      const updated = await landmarkModel.getLandmark(userEmail, categoryId, landmarkId);
      expect(updated.landmarkTitle).to.equal(updatedLandmark.landmarkTitle);
  
      // Delete Landmark
      await landmarkModel.deleteLandmark(userEmail, categoryId, landmarkId);
      const deletedLandmark = await landmarkModel.getLandmark(userEmail, categoryId, landmarkId);
      expect(deletedLandmark).to.be.null;
    });
  });
  

  // Test case: Delete Landmark Category (Dashboard Model)
  describe("Delete Landmark Category", () => {
    it("should delete the added landmark category", async () => {
      await dashboardModel.deleteLandmarkCategory(userEmail, categoryId);
      const categoriesAfterDelete = await dashboardModel.getUserLandmarkCategories(userEmail);
      const deletedCategory = categoriesAfterDelete.find(category => category._id === categoryId);
      expect(deletedCategory).to.be.undefined;
    });
  });

  // Cleanup
  after(async () => {
    // Perform any necessary cleanup
    const db = getDatabase();
    await remove(ref(db, `users/${userEmail}/landmarkCategories/${categoryId}`));
  });
});
