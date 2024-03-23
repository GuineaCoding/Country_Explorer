import { expect } from "chai";
import { getDatabase, ref, remove } from "firebase/database";
import { dashboardModel } from "../../src/models/dashboard-model.js";
import { landmarkModel } from "../../src/models/landmark-model.js";

describe("Landmark and Dashboard Model Tests", () => {
  const userEmail = "testuser@example,com";
  const testCategory = { name: "Test Category" };
  let categoryId;

  const testLandmark = { landmarkTitle: "testLandmark", description: "A test landmark" };
  const testLandmarkId = "testLandmark"; // Ensure this is the correct landmark ID
  const updatedLandmark = { landmarkTitle: "Updated Test Landmark", description: "Updated description" };

  // Add Landmark Category
  it("should add a new landmark category", async () => {
    await dashboardModel.addLandmarkCategory(userEmail, testCategory);
    const categories = await dashboardModel.getUserLandmarkCategories(userEmail);
    const addedCategory = categories.find(category => category.name === testCategory.name);
    expect(addedCategory).to.not.be.undefined;
    categoryId = addedCategory._id;
  });

  // Add Landmark
  it("should add a landmark", async () => {
    await landmarkModel.addLandmark(userEmail, categoryId, testLandmark);
    const category = await landmarkModel.getLandmarkCategory(userEmail, categoryId);
    expect(category.landmarks).to.be.an("array"); // Adjust according to the actual data structure
  });

  // Update and Verify Landmark
  it("should update a landmark", async () => {
    await landmarkModel.updateLandmark(userEmail, categoryId, testLandmarkId, updatedLandmark);
    const updated = await landmarkModel.getLandmark(userEmail, categoryId, testLandmarkId);
    expect(updated.landmarkTitle).to.equal(updatedLandmark.landmarkTitle);
  });

  // Delete Landmark
  it("should delete a landmark", async () => {
    await landmarkModel.deleteLandmark(userEmail, categoryId, testLandmarkId);
    const deletedLandmark = await landmarkModel.getLandmark(userEmail, categoryId, testLandmarkId);
    expect(deletedLandmark).to.be.null;
  });

  // Delete Landmark Category
  it("should delete the added landmark category", async () => {
    await dashboardModel.deleteLandmarkCategory(userEmail, categoryId);
    const categoriesAfterDelete = await dashboardModel.getUserLandmarkCategories(userEmail);
    const deletedCategory = categoriesAfterDelete.find(category => category._id === categoryId);
    expect(deletedCategory).to.be.undefined;
  });

  // Cleanup - Delete the test data
  after(async () => {
    const db = getDatabase();
    const categoryRef = ref(db, `users/${userEmail}/landmarkCategories/${categoryId}`);
    await remove(categoryRef);
  });
});
