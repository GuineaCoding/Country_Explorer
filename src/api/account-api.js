import Boom from "@hapi/boom";
import db from "../../firebaseInit.js";

export const accountApi = {
  create: {
    auth: false,
    handler: async function(request, h) {
      try {
        const userEmail = request.payload.email.replace(".", ",");
        const userRef = db.ref("users/" + userEmail);
        await userRef.set(request.payload);
        return h.response({ message: "User created successfully" }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error: " + err.message);
      }
    },
  },

  find: {
    auth: false,
    handler: async function(request, h) {
      try {
        const usersRef = db.ref("user");
        const snapshot = await usersRef.once("value");
        if (!snapshot.exists()) {
          return Boom.notFound("No users found");
        }
        const users = snapshot.val();
        return h.response(users).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error: " + err.message);
      }
    },
  },
};
