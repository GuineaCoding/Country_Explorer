import { LandmarkSpec } from "../models/joi-schemas.js";
import { getDatabase, ref, get, push, remove, set } from "firebase/database";

export const landmarkCategoryController = {
  index: {
    handler: async function (request, h) {
      const categoryId = request.params.id;
      const firebaseDB = getDatabase();
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      let landmarkCategory;
  
      try {
        const landmarkCategoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
        const landmarkCategorySnap = await get(landmarkCategoryRef);
  
        if (landmarkCategorySnap.exists()) {
          landmarkCategory = landmarkCategorySnap.val();
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
        } else {
          return h.response("Not Found").code(404);
        }
      } catch (error) {
        return h.response("An internal server error occurred").code(500);
      }
  
      const viewData = {
        title: "Landmark Category",
        landmarkCategory: landmarkCategory,
      };
  
      return h.view("landmarkCategory-view", viewData);
    },
  },

  addLandmark: {
    validate: {
      payload: LandmarkSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        // console.log("Validation failed for addLandmark");
        const firebaseDB = getDatabase();
        const userEmail = request.auth.credentials.email.replace(/\./g, ',');
        const categoryId = request.params.id;
        // console.log(`Fetching landmark category from Firebase for category ID: ${categoryId}`);
        const landmarkCategoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
        const landmarkCategorySnap = await get(landmarkCategoryRef);
        
        if (!landmarkCategorySnap.exists()) {
          // console.log("Landmark category not found in Firebase during validation fail action");
          return h.response("Landmark category not found").code(404);
        }
        
        const landmarkCategory = landmarkCategorySnap.val();
        landmarkCategory._id = categoryId;
        // console.log("Rendering 'landmarkCategory-view' with validation errors");

        return h.view("landmarkCategory-view", {
          title: "Add landmark error",
          landmarkCategory: landmarkCategory,
          errors: error.details
        }).takeover().code(400);
      }
    },
    handler: async function (request, h) {
      // console.log("Processing addLandmark request");
      const categoryId = request.params.id;
      const firebaseDB = getDatabase();
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      const newLandmark = {
        landmarkTitle: request.payload.landmarkTitle,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };

      try {
        // console.log(`Adding new landmark to Firebase under category ID: ${categoryId}`);
        const newLandmarkRef = push(ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks`));
        await set(newLandmarkRef, newLandmark);
        // console.log(`New landmark added under category ${categoryId} with ID: ${newLandmarkRef.key}`);
      } catch (error) {
        // console.error(`Error adding new landmark to category ${categoryId}:`, error);
        return h.response("An internal server error occurred").code(500);
      }

      // console.log(`Redirecting to landmarkCategory view for category ID: ${categoryId}`);
      return h.redirect(`/landmarkCategory/${categoryId}`);
    }
  },

  deleteLandmark: {
    handler: async function (request, h) {
      const categoryId = request.params.id;
      const landmarkId = request.params.landmarkId;
      const firebaseDB = getDatabase();
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
  
      try {
        const landmarkRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks/${landmarkId}`);
        await remove(landmarkRef);
        console.log(`Landmark with ID ${landmarkId} deleted from category ${categoryId}`);
      } catch (error) {
        console.error(`Error deleting landmark with ID ${landmarkId} from category ${categoryId}:`, error);
        return h.response("An internal server error occurred").code(500);
      }
  
      return h.redirect(`/landmarkCategory/${categoryId}`);
    }
  },
};
