import { adminModel } from "../models/admin-model.js";
import { accountsModel } from "../models/accounts-model.js";

export const adminController = {
    index: {
        handler: async function(request, h) {
            try {
                const users = await adminModel.getAllUsers();
                return h.view('admin-view', {
                    title: 'Admin Dashboard',
                    users: users
                });
            } catch (error) {
                console.error('Error in admin index:', error);
                return h.response('Internal Server Error').code(500);
            }
        }
    },

    deleteUser: {
        handler: async function(request, h) {
            try {
                const userEmail = request.params.email;
                await adminModel.deleteUser(userEmail);
                return h.redirect('/admin');
            } catch (error) {
                console.error('Error in delete user:', error);
                return h.response('Internal Server Error').code(500);
            }
        }
    },

    showEditUser: {
        handler: async function(request, h) {
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

    updateUser: {
        handler: async function(request, h) {
          const originalEmail = request.payload.originalEmail; 
          const updatedData = {
            email: request.payload.email,
            firstName: request.payload.firstName,
            lastName: request.payload.lastName,
            password: request.payload.password,
            role: request.payload.role
          };
      
          console.log(`Updating user with original email: ${originalEmail}`);
      
          try {
            await accountsModel.updateUser(originalEmail, updatedData);
            return h.redirect("/admin");
          } catch (error) {
            console.error("Error in updateUser:", error);
            return h.response("An internal server error occurred").code(500);
          }
        }
      },
};
