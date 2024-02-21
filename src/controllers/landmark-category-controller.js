import { LandmarkSpec } from "../models/joi-schemas.js";
import { landmarkModel } from "../models/landmark-model.js"; // Ensure the path is correct

export const landmarkCategoryController = {
  index: {
    handler: async function (request, h) {
      const categoryId = request.params.id;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      try {
        const landmarkCategory = await landmarkModel.getLandmarkCategory(userEmail, categoryId);
        if (!landmarkCategory) {
          return h.response("Not Found").code(404);
        }
        return h.view("landmarkCategory-view", {
          title: "Landmark Category",
          landmarkCategory: landmarkCategory,
        });
      } catch (error) {
        console.error("Error in index handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  addLandmark: {
    validate: {
      payload: LandmarkSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("landmarkCategory-view", {
          title: "Add Landmark Error",
          errors: error.details,
        }).takeover().code(400);
      }
    },
    handler: async function (request, h) {
      const categoryId = request.params.id;
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      const newLandmark = {
        landmarkTitle: request.payload.landmarkTitle,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };
      try {
        const landmarkId = await landmarkModel.addLandmark(userEmail, categoryId, newLandmark);
        return h.redirect(`/landmarkCategory/${categoryId}`);
      } catch (error) {
        console.error("Error in addLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  deleteLandmark: {
    handler: async function (request, h) {
      const categoryId = request.params.id;
      const landmarkId = request.params.landmarkId;
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      try {
        await landmarkModel.deleteLandmark(userEmail, categoryId, landmarkId);
        return h.redirect(`/landmarkCategory/${categoryId}`);
      } catch (error) {
        console.error("Error in deleteLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    }
  },
};
