import { getDatabase, ref, set, push, get } from "firebase/database";
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
        console.log("User Payload:", user); 
  
      
        const plainUserObject = { ...user };
        console.log("User object to be saved:", plainUserObject);
  
        const firebaseDB = getDatabase();
        const usersRef = ref(firebaseDB, `users/${user.email.replace(".", ",")}`);
        await set(usersRef, plainUserObject);
        console.log("User registered in Firebase"); 
  
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
      console.log("Login attempt started"); 
      try {
        const { email, password } = request.payload;
        console.log(`Attempting to log in with email: ${email}`); 
  
        const firebaseDB = getDatabase();
        const usersRef = ref(firebaseDB, `users/${email.replace(".", ",")}`);
        
        let user;
        await get(usersRef).then((snapshot) => {
          if (snapshot.exists()) {
            user = snapshot.val();
            console.log("User found in Firebase:", user);
          } else {
            console.log("No user data available in Firebase for this email"); 
          }
        });
  
        if (user && user.password === password) {
          console.log("User authenticated successfully"); 
          return h.redirect("/dashboard");
        } 
      } catch (error) {
        console.error("Error in login:", error); 
        return h.response("An internal server error occurred").code(500);
      }
    },
  },
  logout: {
    handler: function (request, h) {
      return h.redirect("/");
    },
  },
};
