import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { accountsModel } from "../models/accounts-model.js";

// Controller for handling account-related actions
export const accountsController = {
  // Handler for rendering the main page
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Country Explorer" });
    },
  },

  // Handler for rendering the signup page
  showSignup: {
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    handler: function (request, h) {
      if (request.auth.isAuthenticated) {
        return h.redirect("/dashboard");
      }
      return h.view("signup-view", { title: "Sign up for Country Explorer" });
    },
  },

  // Handler for processing user signup
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

      // Check if email already exists
      const existingUser = await accountsModel.getUserByEmail(user.email);
      if (existingUser) {
        // User already exists with this email, display error message
        const error = "Email already in use";
        return h.view("signup-view", { title: "Sign up", error, user }).code(400);
      }

      // If email doesn't exist, create a new user
      await accountsModel.createUser(user);
      return h.redirect("/login");
    } catch (error) {
      console.error("Error in signup:", error);
      return h.response("An internal server error occurred").code(500);
    }
  },
},

  // Handler for rendering the login page
  showLogin: {
    auth: {
      mode: "try",
      strategy: "session"
    },
    handler: function (request, h) {
      if (request.auth.isAuthenticated) {
        return h.redirect("/dashboard");
      }
      return h.view("login-view", { title: "Login to Country Explorer" });
    },
  },

  // Handler for processing user login
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
        if (!user || user.password !== password) {
          // Wrong email or password, display error
          return h.view("login-view", { title: "Log in", error: "Invalid email or password" }).code(400);
        }
        
        // User authentication successful
        request.cookieAuth.set({ id: user._id, email: user.email });
  
        // Update user analytics data
        const analyticsData = {
          date: new Date().toISOString().split("T")[0],
          deviceInfo: request.headers["user-agent"],
          ip: request.headers["x-forwarded-for"] || request.info.remoteAddress,
        };
        await accountsModel.updateUserAnalytics(user.email, analyticsData);
  
        return h.redirect("/dashboard");
      } catch (error) {
        console.error("Error during login:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
  
  // Handler for user logout
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  // Function to validate user session
  validate: async function (request, session) {

    if (!session || !session.email) {
      console.error("Session email is undefined.");
      return { isValid: false };
    }

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
  }
};
