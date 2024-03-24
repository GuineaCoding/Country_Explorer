import { accountsModel } from "../models/accounts-model.js";

// Controller for handling account editing actions
export const editAccountController = {
  // Handler for showing the edit profile page
  showEditProfile: {
    handler: async function (request, h) {
      // Check if the user is an admin
      const isAdmin = request.auth.credentials && request.auth.credentials.role === "admin";
      // Redirect to login page if the user is not authenticated
      if (!request.auth.isAuthenticated) {
        return h.redirect("/login");
      }
      // Retrieve the user's email from authentication credentials
      const userEmail = request.auth.credentials.email;
      try {
        // Get user data from the database using the email
        const user = await accountsModel.getUserByEmail(userEmail);
        // If user not found, return 404 response
        if (!user) {
          return h.response("User not found").code(404);
        }
        // Render the edit profile view with user data
        return h.view("edit-profile-view", { title: "Edit Profile", user: user, isAdmin: isAdmin });
      } catch (error) {
        // Handle internal server error
        console.error("Error in showEditProfile:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  // Handler for updating user profile
  updateProfile: {
    handler: async function (request, h) {
      // Redirect to login page if the user is not authenticated
      if (!request.auth.isAuthenticated) {
        return h.redirect("/login");
      }

      // Retrieve the original email of the user
      const originalEmail = request.auth.credentials.email;
      // Retrieve updated user data from the request payload
      const updatedUserData = request.payload;

      try {
        // If the user's email has changed, update the session cookie with the new email
        if (updatedUserData.email && originalEmail !== updatedUserData.email) {
          request.cookieAuth.set({ id: request.auth.credentials.id, email: updatedUserData.email });
          console.log("Session email updated to:", updatedUserData.email);
        }

        // Update user data in the database
        await accountsModel.updateUser(originalEmail, updatedUserData);
        console.log("Firebase user data updated for:", originalEmail);

        // Redirect to the dashboard after successful update
        return h.redirect("/dashboard");
      } catch (error) {
        // Handle internal server error
        console.error("Error in updateProfile:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
};
