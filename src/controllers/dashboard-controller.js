import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const landmarks = await db.landmarkStore.getAllLandmarks(); // Corrected to landmarkStore
      const viewData = {
        title: "Landmark Dashboard",
        landmarks: landmarks,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addLandmark: {
    handler: async function (request, h) {
      const newLandmark = {
        title: request.payload.title,
      };
      await db.landmarkStore.addLandmark(newLandmark); // Corrected to landmarkStore
      return h.redirect("/dashboard");
    },
  },
};
