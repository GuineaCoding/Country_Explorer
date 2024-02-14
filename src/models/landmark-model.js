// landmark-model.js
import { getDatabase, ref, get, push, remove, set } from "firebase/database";

export const landmarkModel = {
  async getLandmarkCategory(userEmail, categoryId) {
    const firebaseDB = getDatabase();
    const landmarkCategoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
    const landmarkCategorySnap = await get(landmarkCategoryRef);
    if (landmarkCategorySnap.exists()) {
      let landmarkCategory = landmarkCategorySnap.val();
      landmarkCategory._id = categoryId;
      return landmarkCategory;
    }
    return null;
  },

  async addLandmark(userEmail, categoryId, newLandmark) {
    const firebaseDB = getDatabase();
    const newLandmarkRef = push(ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks`));
    await set(newLandmarkRef, newLandmark);
    return newLandmarkRef.key;
  },

  async deleteLandmark(userEmail, categoryId, landmarkId) {
    const firebaseDB = getDatabase();
    const landmarkRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks/${landmarkId}`);
    await remove(landmarkRef);
  }
};
