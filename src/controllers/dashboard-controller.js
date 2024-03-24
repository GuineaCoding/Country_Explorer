import { LandmarkCategorySpec } from "../models/joi-schemas.js";
import { dashboardModel } from "../models/dashboard-model.js";

// Controller for handling dashboard-related actions
export const dashboardController = {
  // Handler for rendering the dashboard
  index: {
    handler: async function (request, h) {
      // Extract user email and admin status from request credentials
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      const isAdmin = request.auth.credentials.role === "admin";
      try {
        // Retrieve landmark categories for the user
        const landmarkCategories = await dashboardModel.getUserLandmarkCategories(userEmail);
        // Render the dashboard view with necessary data
        return h.view("dashboard-view", {
          title: "Playtime Dashboard",
          user: request.auth.credentials,
          landmarkCategories: landmarkCategories,
          isAdmin: isAdmin 
        });
      } catch (error) {
        // Handle internal server error
        console.error("Error in dashboard index handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  // Handler for adding a landmark category
  addLandMarkCategory: {
    validate: {
      // Validate payload against LandmarkCategorySpec schema
      payload: LandmarkCategorySpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        // Render dashboard view with error details if validation fails
        return h.view("dashboard-view", { title: "Add Landmark error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      // Extract user email from request credentials
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      // Prepare new landmark category object
      const newLandmarkCategory = {
        title: request.payload.title,
      };
  
      try {
        // Check if category title already exists
        const categories = await dashboardModel.getUserLandmarkCategories(userEmail);
        const titleExists = categories.some(category => category.title === newLandmarkCategory.title);
        if (titleExists) {
          const error = "Landmark category title already in use";
          return h.view("dashboard-view", { title: "Add Landmark", error }).code(400);
        }
  
        // Add the new landmark category
        await dashboardModel.addLandmarkCategory(userEmail, newLandmarkCategory);
        // Redirect to dashboard after successful addition
        return h.redirect("/dashboard");
      } catch (error) {
        // Handle internal server error
        console.error("Error adding new landmark category:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
  

  // Handler for deleting a landmark category
  deleteLandmarkCategory: {
    handler: async function (request, h) {
      // Extract user email and category ID from request parameters
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      const categoryId = request.params.id;

      try {
        // Delete the specified landmark category
        await dashboardModel.deleteLandmarkCategory(userEmail, categoryId);
        // Redirect to dashboard after successful deletion
        return h.redirect("/dashboard");
      } catch (error) {
        // Handle internal server error
        console.error("Error deleting landmark category:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
};
