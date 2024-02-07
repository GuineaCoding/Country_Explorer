import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const userEmail = request.auth.credentials.email; 
      const firebaseDB = getDatabase();
      const landmarksRef = ref(firebaseDB, "landmarks");
      let userLandmarks = [];
  
      await onValue(landmarksRef, (snapshot) => {
        const landmarks = snapshot.val();
        userLandmarks = Object.values(landmarks).filter(landmark => landmark.userEmail === userEmail.replace(".", ","));
      });
  
      const viewData = {
        title: "Landmark Dashboard",
        landmarks: userLandmarks,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addLandmark: {
    handler: async function (request, h) {
      const userEmail = request.auth.credentials.email; // Get user email from authenticated session
      const newLandmark = {
        title: request.payload.title,
        userEmail: userEmail.replace(".", ","), // Store user email with landmark
      };
      const firebaseDB  = getDatabase();
      const landmarksRef = ref(firebaseDB , "landmarks");
      await push(landmarksRef, newLandmark);
      return h.redirect("/dashboard");
    },
  },
};
