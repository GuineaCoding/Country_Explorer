import { getDatabase, ref, set, push, onValue } from "firebase/database";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      if (!request.auth.isAuthenticated) {
        return h.redirect("/login");
      }

      const userEmail = request.auth.credentials.email; 
      const firebaseDB = getDatabase();
      const landmarksRef = ref(firebaseDB, "landmarks");
      let userLandmarks = [];

      await onValue(landmarksRef, (snapshot) => {
        const landmarks = snapshot.val();
        if (landmarks) {
          userLandmarks = Object.values(landmarks).filter(landmark => landmark.userEmail === userEmail.replace(".", ","));
        }
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
      if (!request.auth.isAuthenticated) {
        // Redirect to login if the user is not authenticated
        return h.redirect("/login");
      }

      const userEmail = request.auth.credentials.email;
      const newLandmark = {
        title: request.payload.title,
        userEmail: userEmail.replace(".", ","), 
      };
      const firebaseDB  = getDatabase();
      const landmarksRef = ref(firebaseDB , "landmarks");
      await push(landmarksRef, newLandmark);
      return h.redirect("/dashboard");
    },
  },
};
