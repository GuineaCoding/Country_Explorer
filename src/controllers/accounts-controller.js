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
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    handler: function (request, h) {
      if (request.auth.isAuthenticated) {
        // User is already logged in, redirect to dashboard
        return h.redirect("/dashboard");
      }
      // Show the signup page if not authenticated
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
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    handler: function (request, h) {
      if (request.auth.isAuthenticated) {
        // User is already logged in, redirect to dashboard
        return h.redirect("/dashboard");
      }
      // Show the login page if not authenticated
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
    // Check if the session object is an array and use the first element if so
    if (Array.isArray(session)) {
      console.log("Session is an array. Using the first email:", session[0].email);
      session = session[0];
    }
  
    // Check if session.email is defined
    if (!session || !session.email) {
      console.error("Session email is undefined.");
      return { isValid: false };
    }
  
    try {
      console.log("Session Email in validate function:", session.email);
      const user = await accountsModel.getUserByEmail(session.email);
      console.log("User found in validate function:", user);
  
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
};
