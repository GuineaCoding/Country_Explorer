import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { accountsModel } from "../models/accounts-model.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Country Explorer" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Country Explorer" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const user = request.payload;
        await accountsModel.createUser(user);
        return h.redirect("/login");
      } catch (error) {
        console.error("Error in signup:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Country Explorer" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      try {
        const user = await accountsModel.getUserByEmail(email);
        if (user && user.password === password) {
          request.cookieAuth.set({ id: user._id, email: user.email });
          return h.redirect("/dashboard");
        } else {
          return h.redirect("/");
        }
      } catch (error) {
        console.error("Error during login:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  validate: async function (request, session) {
    try {
      const user = await accountsModel.getUserByEmail(session.email);
      if (user) {
        return { isValid: true, credentials: user };
      } else {
        return { isValid: false };
      }
    } catch (error) {
      console.error("Error during session validation:", error);
      return { isValid: false };
    }
  },

  showEditProfile: {
    handler: async function (request, h) {
      if (!request.auth.isAuthenticated) {
        return h.redirect('/login');
      }
      const userEmail = request.auth.credentials.email;
      try {
        const user = await accountsModel.getUserByEmail(userEmail);
        return h.view("edit-profile-view", { title: "Edit Profile", user: user });
      } catch (error) {
        console.error("Error in showEditProfile:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  updateProfile: {
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("edit-profile-view", { title: "Edit Profile error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function(request, h) {
      if (!request.auth.isAuthenticated) {
        return h.redirect('/login');
      }
  
      const userEmail = request.auth.credentials.email;
      console.log('User Email:', userEmail); 
  
      try {
        const updatedUserData = request.payload; 
        await accountsModel.updateUser(userEmail, updatedUserData);
        return h.redirect("/dashboard");
      } catch (error) {
        console.error("Error in updateProfile:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
};
