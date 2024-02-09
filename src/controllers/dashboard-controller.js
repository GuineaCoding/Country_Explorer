import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get, push } from "firebase/database";
import firebaseConfig from "../../firebaseConfig.js";

if (getApps().length === 0) {
  console.log("Initializing Firebase");
  initializeApp(firebaseConfig);
} else {
  console.log("Firebase already initialized");
}

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      console.log("Accessing the userId from the cookie");
      const cookieData = request.state["COOKIE_NAME_HERE"];
      console.log("Cookie data:", cookieData);

      const userId = cookieData.id;
      const userEmail = cookieData.email;
      console.log("UserId from cookie:", userId);
      console.log("UserEmail from cookie:", userEmail);

      if (!userId || !userEmail) {
        console.log("User ID/Email not found in cookie, redirecting to login");
        return h.redirect("/login");
      }

      const firebaseDB = getDatabase();

      const landmarksRef = ref(firebaseDB, `landmarks/${userEmail.replace(/\./g, ",")}`);
      const landmarks = [];
      try {
        const landmarksSnap = await get(landmarksRef);
        if (landmarksSnap.exists()) {
          landmarksSnap.forEach((childSnapshot) => {
            landmarks.push(childSnapshot.val());
            console.log("Landmark added:", childSnapshot.val());
          });
        } else {
          console.log("No landmarks found for user in Firebase");
        }
      } catch (error) {
        console.error("Error retrieving landmarks from Firebase:", error);
        return h.response("An internal server error occurred").code(500);
      }

      const viewData = {
        title: "Landmark Dashboard",
        landmarks: landmarks,
      };

      console.log("Rendering dashboard view");
      return h.view("dashboard-view", viewData);
    },
  },

  addLandmark: {
    handler: async function (request, h) {
      console.log("Adding a new landmark");
      const cookieData = request.state["COOKIE_NAME_HERE"];
      console.log("Cookie data for landmark addition:", cookieData);

  
      const userEmail = cookieData.email;
      console.log("UserEmail for landmark addition:", userEmail);

      if (!userEmail) {
        console.log("User Email not found during landmark addition");
        return h.redirect("/login");
      }

      const firebaseDB = getDatabase();
      const newLandmark = {
        title: request.payload.title,
        user: userEmail.replace(/\./g, ","),
      };
      const landmarksRef = ref(firebaseDB, `landmarks/${userEmail.replace(/\./g, ",")}`);
      try {
        console.log("Trying to add new landmark to Firebase");
        await push(landmarksRef, newLandmark);
        console.log("New landmark added to Firebase:", newLandmark);
      } catch (error) {
        console.error("Error adding new landmark to Firebase:", error);
        return h.response("An internal server error occurred").code(500);
      }

      console.log("Redirecting to dashboard after adding landmark");
      return h.redirect("/dashboard");
    },
  },
};
