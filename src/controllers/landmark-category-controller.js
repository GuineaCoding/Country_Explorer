import { LandmarkSpec } from "../models/joi-schemas.js";
import { landmarkModel } from "../models/landmark-model.js"; 

// Controller for handling landmark category actions
export const landmarkCategoryController = {
  // Handler for rendering the landmark category page
  index: {
    handler: async function (request, h) {
      // Extract category ID and user email from request
      const categoryId = request.params.id;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      // Check if the user is an admin
      const isAdmin = request.auth.credentials && request.auth.credentials.role === "admin";
      try {
        // Retrieve landmark category data from the model
        const landmarkCategory = await landmarkModel.getLandmarkCategory(userEmail, categoryId);
        // If category not found, return 404 response
        if (!landmarkCategory) {
          return h.response("Not Found").code(404);
        }
        // Render the landmark category view with data
        return h.view("landmarkCategory-view", {
          title: "Landmark Category",
          landmarkCategory: landmarkCategory,
          isAdmin: isAdmin
        });
      } catch (error) {
        // Handle internal server error
        console.error("Error in index handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  // Handler for adding a landmark
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
      // Extract category ID and user email from request
      const categoryId = request.params.id;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      // Prepare data for adding a new landmark
      const newLandmark = {
        landmarkTitle: request.payload.landmarkTitle,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };
      try {
        // Add the landmark to the model
        const landmarkId = await landmarkModel.addLandmark(userEmail, categoryId, newLandmark);
        // Redirect to the landmark category page after successful addition
        return h.redirect(`/landmarkCategory/${categoryId}`);
      } catch (error) {
        // Handle internal server error
        console.error("Error in addLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  // Handler for deleting a landmark
  deleteLandmark: {
    handler: async function (request, h) {
      // Extract category ID, landmark ID, and user email from request
      const categoryId = request.params.id;
      const landmarkId = request.params.landmarkId;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      try {
        // Delete the landmark from the model
        await landmarkModel.deleteLandmark(userEmail, categoryId, landmarkId);
        // Redirect to the landmark category page after successful deletion
        return h.redirect(`/landmarkCategory/${categoryId}`);
      } catch (error) {
        // Handle internal server error
        console.error("Error in deleteLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    }
  },

  // Handler for showing the edit landmark page
  showEditLandmark: {
    handler: async function(request, h) {
      // Extract category ID, landmark ID, and user email from request
      const categoryId = request.params.categoryId;
      const landmarkId = request.params.landmarkId;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      try {
        // Retrieve landmark category and landmark data from the model
        const landmarkCategory = await landmarkModel.getLandmarkCategory(userEmail, categoryId);
        const landmark = await landmarkModel.getLandmark(userEmail, categoryId, landmarkId);
        // Render the edit landmark view with data
        return h.view("edit-landmark-view", { 
          title: "Edit Landmark", 
          landmarkCategory: landmarkCategory, 
          landmark: landmark 
        });
      } catch (error) {
        // Handle internal server error
        console.error("Error in showEditLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    }
  },

  // Handler for updating a landmark
  updateLandmark: {
    handler: async function(request, h) {
      // Extract category ID, landmark ID, and user email from request
      const categoryId = request.params.categoryId;
      const landmarkId = request.params.landmarkId;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      const updatedData = request.payload;
      // Log update information
      console.log(`UpdateLandmark handler invoked for Category ID: ${categoryId}, Landmark ID: ${landmarkId}`);
      console.log(`User Email: ${userEmail}`);
      console.log(`Updated Data: ${JSON.stringify(updatedData)}`);
      try {
        // Update the landmark in the model
        console.log("Attempting to update landmark in model...");
        await landmarkModel.updateLandmark(userEmail, categoryId, landmarkId, updatedData);
        console.log("Landmark updated successfully. Redirecting...");
        // Redirect to the landmark category page after successful update
        return h.redirect(`/landmarkCategory/${categoryId}`);
      } catch (error) {
        // Handle internal server error
        console.error("Error in updateLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    }
  },

  // Handler for uploading a file (e.g., image) associated with a landmark
  uploadFile: {
    handler: async function (request, h) {
      // Extract category ID, landmark ID, and user email from request
      const categoryId = request.params.categoryId;
      const landmarkId = request.params.landmarkId;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      const payload = request.payload;
      // Log payload information
      console.log("Payload:", payload);
      console.log("Category ID:", categoryId, "Landmark ID:", landmarkId);
      try {
        // Upload the file and get the URL
        const fileURL = await landmarkModel.uploadFile(categoryId, landmarkId, payload.file);
        console.log("File uploaded, URL:", fileURL);
        // Update the landmark with the file URL
        await landmarkModel.updateLandmarkWithFileURL(userEmail, categoryId, landmarkId, fileURL);
      
        // Redirect to the edit page
        return h.redirect(`/landmarkCategory/${categoryId}/editLandmark/${landmarkId}`);
      } catch (error) {
        // Handle file upload error
        console.error("Could not upload file", error);
        return h.response({ error: "File upload failed" }).code(500);
      }
    },
    // Configuration for handling file uploads
    payload: {
      output: "data",
      parse: true,
      allow: "multipart/form-data",
      multipart: true
    }
  }
};
