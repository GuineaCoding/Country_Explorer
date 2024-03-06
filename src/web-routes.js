import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { landmarkCategoryController } from "./controllers/landmark-category-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addLandMarkCategory", config: dashboardController.addLandMarkCategory },
  { method: "GET", path: "/dashboard/deleteLandmarkCategory/{id}", config: dashboardController.deleteLandmarkCategory },

  { method: "GET", path: "/landmarkCategory/{id}", config: landmarkCategoryController.index },
  { method: "POST", path: "/landmarkCategory/{id}/addLandmark", config: landmarkCategoryController.addLandmark },
  { method: "GET", path: "/landmarkCategory/{id}/deleteLandmark/{landmarkId}", config: landmarkCategoryController.deleteLandmark },
  { method: "POST", path: "/landmarkCategory/{id}/file", config: landmarkCategoryController.uploadFile },
];
