import { getDatabase, ref, get, set } from "firebase/database";
import { db } from "../models/db.js";

export const accountsController = {
  index: {
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Country Explorer" });
    },
  },
  showSignup: {
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Country Explorer" });
    },
  },
  signup: {
    handler: async function (request, h) {
      try {
        const user = request.payload;

        await db.userStore.addUser(user);


        const firebaseDB = getDatabase();
        const sanitizedEmail = user.email.replace(/\./g, ",");
        const usersRef = ref(firebaseDB, `users/${sanitizedEmail}`);
        await set(usersRef, user);

        return h.redirect("/");
      } catch (error) {
        console.error("Error in signup:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
  showLogin: {
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Country Explorer" });
    },
  },
  login: {
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const firebaseDB = getDatabase();
      const sanitizedEmail = email.replace(/\./g, ",");
      const userRef = ref(firebaseDB, `users/${sanitizedEmail}`);

      try {
        const userSnap = await get(userRef);
        if (userSnap.exists()) {
          const user = userSnap.val();
          if (user && user.password === password) {
            request.cookieAuth.set({ id: user._id });
            return h.redirect("/dashboard");
          } else {
       
            return h.redirect("/login");
          }
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
      return h.redirect("/login");
    },
  },
};
