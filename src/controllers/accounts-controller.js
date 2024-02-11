import { getDatabase, ref, get, set } from "firebase/database";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      // Render the main view with a title
      return h.view("main", { title: "Welcome to Country Explorer" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      // Render the signup view with a title
      return h.view("signup-view", { title: "Sign up for Country Explorer" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        // Render the signup view with validation errors
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const user = request.payload;

        // Initialize Firebase Database
        const firebaseDB = getDatabase();
        const usersRef = ref(firebaseDB, `users/${user.email.replace(/\./g, ",")}`);

        // Save user to Firebase
        const plainUserObject = { ...user };
        await set(usersRef, plainUserObject);

       // Redirect to login page after successful signup
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
        console.log("Validation failed:", error);
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const sanitizedEmail = email.replace(/\./g, ",");
      console.log(`Attempting login for email: ${sanitizedEmail}`);

      try {
        const firebaseDB = getDatabase();
        const userRef = ref(firebaseDB, `users/${sanitizedEmail}`);
        // console.log("Firebase ref created:", userRef);

        const userSnap = await get(userRef);
        console.log("Firebase get request completed");

        if (userSnap.exists()) {
          const user = userSnap.val();
          console.log("User found in Firebase:", user);

          if (user.password === password) {
            console.log("Password match, setting cookie");
            request.cookieAuth.set({ id: user._id, email: user.email });
            console.log("Cookie set, redirecting to dashboard");
            return h.redirect("/dashboard");
          } else {
            console.log("Invalid password, redirecting to home");
            return h.redirect("/");
          }
        } else {
          console.log("User not found in Firebase, redirecting to home");
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

  async validate(request, session) {
    try {
      console.log("Validating session:", session);

      // Check if email exists in the session
      if (!session.email) {
        console.log("Email not found in session");
        return { isValid: false };
      }

      // Sanitize the email for Firebase path
      const sanitizedEmail = session.email.replace(/\./g, ",");

      const firebaseDB = getDatabase();
      const userRef = ref(firebaseDB, `users/${sanitizedEmail}`);

      // Fetch user from Firebase
      const userSnap = await get(userRef);
      if (userSnap.exists()) {
        const user = userSnap.val();
        console.log("User found in Firebase during session validation:", user);
        return { isValid: true, credentials: user };
      } else {
        console.log("User not found in Firebase during session validation, session is invalid.");
        return { isValid: false };
      }
    } catch (error) {
      console.error("Error during session validation:", error);
      return { isValid: false };
    }
  },
};
