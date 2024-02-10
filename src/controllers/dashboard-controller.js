import { LandmarkCategorySpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const landmarkCategories = await db.landmarkCategoryStore.getUserLandmarkCategories(loggedInUser._id);
      const viewData = {
        title: "Playtime Dashboard",
        user: loggedInUser,
        landmarkCategories: landmarkCategories,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addLandMarkCategory: {
    validate: {
      payload: LandmarkCategorySpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Add Landmark error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newLandmarkCategory = {
        userid: loggedInUser._id,
        title: request.payload.title,
      };
      await db.landmarkCategoryStore.addLandMarkCategory(newLandmarkCategory);
      return h.redirect("/dashboard");
    },
  },

  deleteLandmarkCategory: {
    handler: async function (request, h) {
      const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
      await db.landmarkCategoryStore.deleteLandmarkCategoryById(landmarkCategory._id);
      return h.redirect("/dashboard");
    },
  },
};
