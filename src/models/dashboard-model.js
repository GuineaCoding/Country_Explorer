// dashboard-model.js
import { getDatabase, ref, get, push, remove } from "firebase/database";

export const dashboardModel = {
  async getUserLandmarkCategories(userEmail) {
    const firebaseDB = getDatabase();
    const userCategoriesRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories`);
    const snapshot = await get(userCategoriesRef);

    if (snapshot.exists()) {
      const categoriesData = snapshot.val();
      return Object.keys(categoriesData).map(key => ({
        _id: key,
        ...categoriesData[key],
      }));
    }
    return [];
  },

  async addLandmarkCategory(userEmail, newCategory) {
    const firebaseDB = getDatabase();
    const userCategoriesRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories`);
    await push(userCategoriesRef, newCategory);
  },

  async deleteLandmarkCategory(userEmail, categoryId) {
    const firebaseDB = getDatabase();
    const categoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
    await remove(categoryRef);
  }
};
