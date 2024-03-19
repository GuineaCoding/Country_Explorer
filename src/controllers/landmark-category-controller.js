import { LandmarkSpec } from "../models/joi-schemas.js";
import { landmarkModel } from "../models/landmark-model.js"; 

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
  showEditLandmark: {
    handler: async function(request, h) {
      const categoryId = request.params.categoryId;
      const landmarkId = request.params.landmarkId;
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      try {
        const landmarkCategory = await landmarkModel.getLandmarkCategory(userEmail, categoryId);
        const landmark = await landmarkModel.getLandmark(userEmail, categoryId, landmarkId);
        return h.view("edit-landmark-view", { 
          title: "Edit Landmark", 
          landmarkCategory: landmarkCategory, 
          landmark: landmark 
        });
      } catch (error) {
        console.error("Error in showEditLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    }
  }
  ,

  updateLandmark: {
    handler: async function(request, h) {
      const categoryId = request.params.categoryId;
      const landmarkId = request.params.landmarkId;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      const updatedData = request.payload;
      
  
      console.log(`UpdateLandmark handler invoked for Category ID: ${categoryId}, Landmark ID: ${landmarkId}`);
      console.log(`User Email: ${userEmail}`);
      console.log(`Updated Data: ${JSON.stringify(updatedData)}`);
  
      try {
        console.log("Attempting to update landmark in model...");
        await landmarkModel.updateLandmark(userEmail, categoryId, landmarkId, updatedData);
        console.log("Landmark updated successfully. Redirecting...");
        return h.redirect(`/landmarkCategory/${categoryId}`);
      } catch (error) {
        console.error("Error in updateLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    }
  },

  uploadFile: {
    handler: async function (request, h) {
      const payload = request.payload
      const landmarkId = request.params.id
      console.log("paylaod", payload)
      console.log("id: ", landmarkId)
      try {
        const resp = await landmarkModel.uploadFile(landmarkId, payload.file)

        console.log("upload response", resp)

      } catch (error) {
        console.error("could not upload file", error)
      }

      return "received"
    },
    payload: {
      output: "data",
      parse: true,
      allow: "multipart/form-data",
      multipart: true
    }
  },
};
