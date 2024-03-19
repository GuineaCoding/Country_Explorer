// landmark-model.js
import { getDatabase, ref, get, push, remove, set } from "firebase/database";
import { getStorage, ref as refStorage, uploadBytes } from "firebase/storage";

export const landmarkModel = {
  async getLandmarkCategory(userEmail, categoryId) {
    const firebaseDB = getDatabase();
    const landmarkCategoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
    const landmarkCategorySnap = await get(landmarkCategoryRef);
    if (landmarkCategorySnap.exists()) {
      let landmarkCategory = landmarkCategorySnap.val();
      landmarkCategory._id = categoryId;

      // Assign _id to each landmark
      if (landmarkCategory.landmarks) {
        landmarkCategory.landmarks = Object.keys(landmarkCategory.landmarks).map(landmarkKey => {
          return {
            _id: landmarkKey,
            ...landmarkCategory.landmarks[landmarkKey]
          };
        });
      }

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
  },

  async getLandmark(userEmail, categoryId, landmarkId) {
    const firebaseDB = getDatabase();
    const landmarkRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks/${landmarkId}`);
    const snapshot = await get(landmarkRef);
    if (snapshot.exists()) {
      return { _id: landmarkId, ...snapshot.val() };
    }
    return null;
  },

async updateLandmark(userEmail, categoryId, landmarkId, updatedData) {
  try {
    const firebaseDB = getDatabase();
    const landmarkRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks/${landmarkId}`);

 
    const plainUpdatedData = JSON.parse(JSON.stringify(updatedData));
    await set(landmarkRef, plainUpdatedData);
  } catch (error) {
    console.error("Error updating landmark:", error);
    throw error;  
  }
},

  async uploadFile(landmarkId, file) {
    const storage = getStorage();
    const storageRef = refStorage(storage, landmarkId);

    const metadata = {
      contentType: 'image/png',
    };
    
    await uploadBytes(storageRef, file, metadata)
  },

};
