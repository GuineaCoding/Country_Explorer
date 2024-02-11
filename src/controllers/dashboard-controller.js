import { getDatabase, ref, get, push, remove } from "firebase/database";
import { LandmarkCategorySpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      // console.log("Dashboard controller accessed");

  
      const credentials = request.auth.credentials;
      if (!credentials || !credentials.email) {
        // console.log("Email not found in session credentials, redirecting to login");
        return h.redirect("/login");
      }
      // console.log(`Retrieved email from session credentials: ${credentials.email}`);

      const sanitizedEmail = credentials.email.replace(/\./g, ",");

      const firebaseDB = getDatabase();
      let user;
      let  landmarkCategories;


      try {
        // console.log("Retrieving user data from Firebase...");
        const userRef = ref(firebaseDB, `users/${sanitizedEmail}`);
        const userSnap = await get(userRef);
        
        if (userSnap.exists()) {
          user = userSnap.val();
          // console.log("User data retrieved from Firebase:", user);
        
      
          landmarkCategories = user.landmarkCategories ? Object.values(user.landmarkCategories) : [];
          // console.log("Landmark categories retrieved from user object:", landmarkCategories);
        } else {
          // console.log("User not found in Firebase, redirecting to login");
          return h.redirect("/login");
        }
      } catch (error) {
        console.error("Error retrieving user from Firebase:", error);
        return h.response("An internal server error occurred").code(500);
      }

    
      try {
        // console.log("Retrieving landmark categories from Firebase...");
        const userEmail = user.email.replace(/\./g, ','); // Convert email for Firebase key
        const landmarkCategoriesRef = ref(firebaseDB, `users/${userEmail}/landmarkCategories`);
        const landmarkCategoriesSnap = await get(landmarkCategoriesRef);
        
        if (landmarkCategoriesSnap.exists()) {
          const categoriesData = landmarkCategoriesSnap.val();
          landmarkCategories = Object.keys(categoriesData).map(key => {
            console.log(`Found category ID: ${key}`); // Log the ID
            return {
              _id: key,
              ...categoriesData[key]
            };
          });
          // console.log("Landmark categories with IDs retrieved:", landmarkCategories);
        } else {
          // console.log("No landmark categories found for the user in Firebase");
        }
      } catch (error) {
        console.error("Error retrieving landmark categories from Firebase:", error);
      }      

      const viewData = {
        title: "Playtime Dashboard",
        user: user,
        landmarkCategories: landmarkCategories,
      };
      // console.log("Rendering dashboard with view data:", viewData);

      return h.view("dashboard-view", viewData);
    },
  },

  addLandMarkCategory: {
    validate: {
      payload: LandmarkCategorySpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        // console.error("Validation failed:", error);
        return h.view("dashboard-view", { title: "Add Landmark error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // console.log("Logged in user details for adding category:", loggedInUser);

      if (!loggedInUser || !loggedInUser.email) {
        // console.error("Logged in user email is undefined for adding category.");
        return h.response("Internal Server Error. User email is undefined.").code(500);
      }

      const sanitizedEmail = loggedInUser.email.replace(/\./g, ",");
      const newLandmarkCategory = {
        
        title: request.payload.title,
      };

      try {
        const firebaseDB = getDatabase();
      
        const userCategoriesRef = ref(firebaseDB, `users/${sanitizedEmail}/landmarkCategories`);

        await push(userCategoriesRef, newLandmarkCategory);
        // console.log("New landmark category added under user in Firebase:", newLandmarkCategory);

        return h.redirect("/dashboard");
      } catch (error) {
        console.error("Error adding new landmark category under user in Firebase:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  deleteLandmarkCategory: {
    handler: async function (request, h) {
      console.log("deleteLandmarkCategory handler accessed");
      const { email } = request.auth.credentials;
      const sanitizedEmail = email.replace(/\./g, ",");
      // Retrieve the categoryId from the URL parameter
      const categoryId = request.params.id;
      console.log(`Category ID received: ${categoryId}`);
  
      if (!categoryId) {
        console.error("No category ID provided in the request");
        return h.response("No category ID provided").code(400);
      }
  
      try {
        const firebaseDB = getDatabase();
        const categoryRef = ref(firebaseDB, `users/${sanitizedEmail}/landmarkCategories/${categoryId}`);
        console.log(`Firebase reference path: users/${sanitizedEmail}/landmarkCategories/${categoryId}`);
  
        // Delete the landmark category from Firebase
        await remove(categoryRef);
        console.log(`Landmark category with ID ${categoryId} deleted from Firebase`);
      } catch (error) {
        console.error("Error deleting landmark category from Firebase:", error);
        return h.response("An internal server error occurred").code(500);
      }
      console.log('test')
      return h.redirect("/dashboard");
    },
  },
};
