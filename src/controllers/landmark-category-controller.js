import { LandmarkSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { getDatabase, ref, get, push, remove, set } from "firebase/database";
import { LandmarkCategorySpec } from "../models/joi-schemas.js";

export const landmarkCategoryController = {
  index: {
    handler: async function (request, h) {
      // console.log("Accessing landmarkCategoryController.index handler");
      const categoryId = request.params.id;
      // console.log(`Received category ID: ${categoryId}`);
      const firebaseDB = getDatabase();
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      // console.log(`Sanitized user email: ${userEmail}`);
      let landmarkCategory;

      try {
        // console.log(`Attempting to retrieve landmark category with ID: ${categoryId} from Firebase`);
        const landmarkCategoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
        const landmarkCategorySnap = await get(landmarkCategoryRef);

        if (landmarkCategorySnap.exists()) {
          landmarkCategory = landmarkCategorySnap.val();
          // console.log(`Landmark category data retrieved: ${JSON.stringify(landmarkCategory)}`);
          landmarkCategory._id = categoryId; 
        } else {
          // console.log(`No landmark category found with ID: ${categoryId}`);
          return h.response("Not Found").code(404);
        }
      } catch (error) {
        // console.error(`Error retrieving landmark category with ID ${categoryId} from Firebase:`, error);
        return h.response("An internal server error occurred").code(500);
      }

      const viewData = {
        title: "Landmark Category",
        landmarkCategory: landmarkCategory,
      };

      console.log(`Rendering view with data: ${JSON.stringify(viewData)}`);
      return h.view("landmarkCategory-view", viewData);
    },
  },

  addLandmark: {
    validate: {
      payload: LandmarkSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        console.log("Validation failed for addLandmark");
        const firebaseDB = getDatabase();
        const userEmail = request.auth.credentials.email.replace(/\./g, ',');
        const categoryId = request.params.id;
        console.log(`Fetching landmark category from Firebase for category ID: ${categoryId}`);
        const landmarkCategoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
        const landmarkCategorySnap = await get(landmarkCategoryRef);
        
        if (!landmarkCategorySnap.exists()) {
          console.log("Landmark category not found in Firebase during validation fail action");
          return h.response("Landmark category not found").code(404);
        }
        
        const landmarkCategory = landmarkCategorySnap.val();
        landmarkCategory._id = categoryId;
        console.log("Rendering 'landmarkCategory-view' with validation errors");

        return h.view("landmarkCategory-view", {
          title: "Add landmark error",
          landmarkCategory: landmarkCategory,
          errors: error.details
        }).takeover().code(400);
      }
    },
    handler: async function (request, h) {
      console.log("Processing addLandmark request");
      const categoryId = request.params.id;
      const firebaseDB = getDatabase();
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      const newTrack = {
        landmarkTitle: request.payload.landmarkTitle,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };

      try {
        console.log(`Adding new landmark to Firebase under category ID: ${categoryId}`);
        const newTrackRef = push(ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}/landmarks`));
        await set(newTrackRef, newTrack);
        console.log(`New landmark added under category ${categoryId} with ID: ${newTrackRef.key}`);
      } catch (error) {
        console.error(`Error adding new landmark to category ${categoryId}:`, error);
        return h.response("An internal server error occurred").code(500);
      }

      console.log(`Redirecting to landmarkCategory view for category ID: ${categoryId}`);
      return h.redirect(`/landmarkCategory/${categoryId}`);
    }
  },

  deleteTrack: {
    handler: async function (request, h) {
      const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
      await db.trackStore.deleteTrack(request.params.trackid);
      return h.redirect(`/landmarkCategory/${landmarkCategory._id}`);
    },
  },
};
