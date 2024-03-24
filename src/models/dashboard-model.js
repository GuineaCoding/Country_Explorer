// dashboard-model.js
import { getDatabase, ref, get, push, remove } from "firebase/database";

// Model for dashboard-related database operations
export const dashboardModel = {
  // Method to retrieve user landmark categories from the database
  async getUserLandmarkCategories(userEmail) {
    const firebaseDB = getDatabase();
    const userCategoriesRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories`);
    const snapshot = await get(userCategoriesRef);

    // Check if categories exist and return them
    if (snapshot.exists()) {
      const categoriesData = snapshot.val();
      return Object.keys(categoriesData).map(key => ({
        _id: key,
        ...categoriesData[key],
      }));
    }
    // Return an empty array if no categories are found
    return [];
  },

  // Method to add a new landmark category for a user in the database
  async addLandmarkCategory(userEmail, newCategory) {
    const firebaseDB = getDatabase();
    const userCategoriesRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories`);
    // Push the new category to the user's categories list
    await push(userCategoriesRef, newCategory);
  },

  // Method to delete a landmark category for a user from the database
  async deleteLandmarkCategory(userEmail, categoryId) {
    const firebaseDB = getDatabase();
    const categoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
    // Remove the specified category from the user's categories list
    await remove(categoryRef);
  }
};
