// landmark-model.js
import { getDatabase, ref, get, push, remove, set, update } from "firebase/database";
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from "firebase/storage";

// Model for landmark-related database operations
export const landmarkModel = {
  // Method to retrieve a landmark category for a user from the database
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

  // Method to add a new landmark to a category for a user in the database
  async addLandmark(userEmail, categoryId, newLandmark) {
    const firebaseDB = getDatabase();
    const newLandmarkRef = push(ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks`));
    await set(newLandmarkRef, newLandmark);
    return newLandmarkRef.key;
  },

  // Method to delete a landmark from a category for a user in the database
  async deleteLandmark(userEmail, categoryId, landmarkId) {
    const firebaseDB = getDatabase();
    const landmarkRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks/${landmarkId}`);
    await remove(landmarkRef);
  },

  // Method to retrieve a specific landmark for a user from the database
  async getLandmark(userEmail, categoryId, landmarkId) {
    const firebaseDB = getDatabase();
    const landmarkRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks/${landmarkId}`);
    const snapshot = await get(landmarkRef);

    if (snapshot.exists()) {
      return { _id: landmarkId, ...snapshot.val() };
    }
    return null;
  },

  // Method to update a landmark in the database
  async updateLandmark(userEmail, categoryId, landmarkId, updatedData) {
    try {
      const firebaseDB = getDatabase();
      const landmarkRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks/${landmarkId}`);

      // Convert updatedData to plain object to avoid Firebase compatibility issues
      const plainUpdatedData = JSON.parse(JSON.stringify(updatedData));
      await set(landmarkRef, plainUpdatedData);
    } catch (error) {
      console.error("Error updating landmark:", error);
      throw error;  
    }
  },

  // Method to upload a file for a landmark and update its URL in the database
  async uploadFile(categoryId, landmarkId, file, userEmail) {
    const storage = getStorage();
    const storageRef = refStorage(storage, `landmarks/${categoryId}/${landmarkId}`);

    const metadata = {
      contentType: "image/png",
    };
    
    await uploadBytes(storageRef, file, metadata);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update landmark with file URL
    await this.updateLandmarkWithFileURL(userEmail, categoryId, landmarkId, downloadURL);

    return downloadURL;
  },

  // Method to update a landmark in the database with a file URL
  async updateLandmarkWithFileURL(userEmail, categoryId, landmarkId, fileURL) {
    const firebaseDB = getDatabase();
    const landmarkRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks/${landmarkId}`);

    await update(landmarkRef, { fileURL });
  }
};
