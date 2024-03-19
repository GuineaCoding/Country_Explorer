import { LandmarkCategorySpec } from "../models/joi-schemas.js";
import { dashboardModel } from "../models/dashboard-model.js"; 

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      const isAdmin = request.auth.credentials.role === "admin";
      try {
        const landmarkCategories = await dashboardModel.getUserLandmarkCategories(userEmail);
        return h.view("dashboard-view", {
          title: "Playtime Dashboard",
          user: request.auth.credentials,
          landmarkCategories: landmarkCategories,
          isAdmin: isAdmin 
        });
      } catch (error) {
        console.error("Error in dashboard index handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
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
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      const newLandmarkCategory = {
        title: request.payload.title,
      };

      try {
        await dashboardModel.addLandmarkCategory(userEmail, newLandmarkCategory);
        return h.redirect("/dashboard");
      } catch (error) {
        console.error("Error adding new landmark category:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  deleteLandmarkCategory: {
    handler: async function (request, h) {
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      const categoryId = request.params.id;

      try {
        await dashboardModel.deleteLandmarkCategory(userEmail, categoryId);
        return h.redirect("/dashboard");
      } catch (error) {
        console.error("Error deleting landmark category:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
};
