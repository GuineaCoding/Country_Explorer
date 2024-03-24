import { adminModel } from "../models/admin-model.js";
import { accountsModel } from "../models/accounts-model.js";

// Controller for handling admin-related actions
export const adminController = {
    // Handler for rendering the admin dashboard
    index: {
        handler: async function (request, h) {
            try {
                const usersObject = await adminModel.getAllUsers();
                const usersArray = Object.values(usersObject); // Convert users object to an array
                const isAdmin = request.auth.credentials && request.auth.credentials.role === "admin";
                const loggedInEmail = request.auth.credentials ? request.auth.credentials.email : null;

                // Filter out the logged-in user's email
                const filteredUsers = usersArray.filter(user => user.email !== loggedInEmail);

                return h.view("admin-view", {
                    title: "Admin Dashboard",
                    users: filteredUsers, // Use the filtered array
                    isAdmin: isAdmin
                });
            } catch (error) {
                console.error("Error in admin index:", error);
                return h.response("Internal Server Error").code(500);
            }
        }
    },

    // Handler for deleting a user
    deleteUser: {
        handler: async function (request, h) {
            try {
                const userEmail = request.params.email;
                await adminModel.deleteUser(userEmail);
                return h.redirect("/admin");
            } catch (error) {
                console.error("Error in delete user:", error);
                return h.response("Internal Server Error").code(500);
            }
        }
    },

    // Handler for rendering the edit user page
    showEditUser: {
        handler: async function (request, h) {
            const userEmail = request.params.email;
            try {
                const user = await accountsModel.getUserByEmail(userEmail);
                return h.view("edit-user-view", {
                    title: "Edit User",
                    user: user
                });
            } catch (error) {
                console.error("Error in showEditUser:", error);
                return h.response("An internal server error occurred").code(500);
            }
        }
    },

    // Handler for rendering the admin panel
    adminPanel: {
        handler: function (request, h) {
            return h.view("admin-panel-view", {
                title: "Admin Panel",
                isAdmin: request.auth.credentials.role === "admin"
            });
        }
    },

    // Handler for updating user information
    updateUser: {
        handler: async function (request, h) {
            const originalEmail = request.payload.originalEmail;
            const updatedData = {
                email: request.payload.email,
                firstName: request.payload.firstName,
                lastName: request.payload.lastName,
                password: request.payload.password,
                role: request.payload.role
            };

            try {
                await accountsModel.updateUser(originalEmail, updatedData);
                return h.redirect("/view-user-accounts");
            } catch (error) {
                console.error("Error in updateUser:", error);
                return h.response("An internal server error occurred").code(500);
            }
        }
    },

    // Handler for viewing user statistics
    viewUserStatistics: {
        handler: async function (request, h) {
            try {
                const allUserAnalytics = await adminModel.getAllUserAnalytics();

                return h.view("view-user-statistics", {
                    title: "User Statistics",
                    analytics: allUserAnalytics
                });
            } catch (error) {
                console.error("Error in viewUserStatistics:", error);
                return h.response("An internal server error occurred").code(500);
            }
        }
    },
};
