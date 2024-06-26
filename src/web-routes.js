import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { landmarkCategoryController } from "./controllers/landmark-category-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { editAccountController } from "./controllers/edit-Account-Controller.js";
import { isAdmin } from "./utils/utils.js";

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
  { method: "POST", path: "/landmarkCategory/{categoryId}/landmark/{landmarkId}/file", config: landmarkCategoryController.uploadFile },
  { method: "GET", path: "/landmarkCategory/{categoryId}/editLandmark/{landmarkId}", config: landmarkCategoryController.showEditLandmark},
  { method: "POST", path: "/landmarkCategory/{categoryId}/updateLandmark/{landmarkId}", config: landmarkCategoryController.updateLandmark},
  { method: "GET", path: "/profile", config: editAccountController.showEditProfile },
  { method: "POST", path: "/profile/update", config: editAccountController.updateProfile },  
  { method: "GET", path: "/view-user-accounts", config: adminController.index },
  { method: "GET", path: "/admin/deleteUser/{email}", config: adminController.deleteUser },
  { method: "GET",  path: "/admin/editUser/{email}", config: adminController.showEditUser },
  { method: "POST", path: "/admin/updateUser", config: adminController.updateUser },
  { method: ["GET", "POST"],  path: "/{any*}", handler: function (request, h) { return h.view("not-found-view", { title: "Not Found" }).code(404);
    }
  },
  { method: "GET", path: "/admin-panel", config: adminController.adminPanel },
  { method: "GET", path: "/view-user-statistics", config: adminController.viewUserStatistics },
];
