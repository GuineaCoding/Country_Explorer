import { TrackSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { getDatabase, ref, get, push, remove } from "firebase/database";
import { LandmarkCategorySpec } from "../models/joi-schemas.js";

export const landmarkCategoryController = {
  index: {
    handler: async function (request, h) {
      console.log("Accessing landmarkCategoryController.index handler");
      const categoryId = request.params.id;
      console.log(`Received category ID: ${categoryId}`);
      const firebaseDB = getDatabase();
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      console.log(`Sanitized user email: ${userEmail}`);
      let landmarkCategory;

      try {
        console.log(`Attempting to retrieve landmark category with ID: ${categoryId} from Firebase`);
        const landmarkCategoryRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories/${categoryId}`);
        const landmarkCategorySnap = await get(landmarkCategoryRef);

        if (landmarkCategorySnap.exists()) {
          landmarkCategory = landmarkCategorySnap.val();
          console.log(`Landmark category data retrieved: ${JSON.stringify(landmarkCategory)}`);
          landmarkCategory._id = categoryId; 
        } else {
          console.log(`No landmark category found with ID: ${categoryId}`);
          return h.response("Not Found").code(404);
        }
      } catch (error) {
        console.error(`Error retrieving landmark category with ID ${categoryId} from Firebase:`, error);
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

  addTrack: {
    validate: {
      payload: TrackSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
        return h.view("landmarkCategory-view", { title: "Add track error", landmarkCategory:currentLandmarkCategory, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
      const newTrack = {
        title: request.payload.title,
        artist: request.payload.artist,
        duration: Number(request.payload.duration),
      };
      await db.trackStore.addTrack(landmarkCategory._id, newTrack);
      return h.redirect(`/landmarkCategory/${landmarkCategory._id}`);
    },
  },

  deleteTrack: {
    handler: async function (request, h) {
      const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
      await db.trackStore.deleteTrack(request.params.trackid);
      return h.redirect(`/landmarkCategory/${landmarkCategory._id}`);
    },
  },
};
