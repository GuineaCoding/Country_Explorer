import Vision from "@hapi/vision";
import Hapi from "@hapi/hapi";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import path from "path";
import Joi from "joi";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import serviceAccount from '../strategic-reef-146715-firebase-adminsdk-xvlx3-d16ab10c2d.json' assert { type: 'json' };
import { webRoutes } from "./web-routes.js";
import { accountsController } from "./controllers/accounts-controller.js";
import "../firebaseInit.js";
import { apiRoutes } from "./api-routes.js"; 
import Handlebars from 'handlebars';
import Inert from '@hapi/inert';
Handlebars.registerHelper('equal', (a, b) => a === b);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://strategic-reef-146715.appspot.com"
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
  });

  await server.register(Vision);
  await server.register(Cookie);
  server.validator(Joi);

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  await server.register(Inert);
  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
        directory: {
            path: path.join(__dirname, "public"),
            listing: true
        }
    }
});

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
  server.auth.default("session");

  server.route(webRoutes);
  server.route(apiRoutes); 
  await server.start();
  console.log("Server running on %s", server.info.uri);
}



process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
