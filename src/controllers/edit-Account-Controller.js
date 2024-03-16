import { accountsModel } from "../models/accounts-model.js";

export const editAccountController = {
  showEditProfile: {
    handler: async function (request, h) {
      if (!request.auth.isAuthenticated) {
        return h.redirect('/login');
      }
      const userEmail = request.auth.credentials.email;
      try {
        const user = await accountsModel.getUserByEmail(userEmail);
        if (!user) {
          return h.response("User not found").code(404);
        }
        return h.view("edit-profile-view", { title: "Edit Profile", user: user });
      } catch (error) {
        console.error("Error in showEditProfile:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

updateProfile: {
  handler: async function (request, h) {
    if (!request.auth.isAuthenticated) {
      return h.redirect('/login');
    }

    const originalEmail = request.auth.credentials.email;
    const updatedUserData = request.payload;

    try {
      if (updatedUserData.email && originalEmail !== updatedUserData.email) {
        request.cookieAuth.set({ id: request.auth.credentials.id, email: updatedUserData.email });
        console.log("Session email updated to:", updatedUserData.email);
      }

      await accountsModel.updateUser(originalEmail, updatedUserData);
      console.log("Firebase user data updated for:", originalEmail);

      return h.redirect("/dashboard");
    } catch (error) {
      console.error("Error in updateProfile:", error);
      return h.response("An internal server error occurred").code(500);
    }
  },
},
 


};
