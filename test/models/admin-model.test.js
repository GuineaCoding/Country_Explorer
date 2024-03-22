import { expect } from "chai";
import database from "../../firebaseConfig.js"; 
import { adminModel } from "../../src/models/admin-model.js";

describe("Admin Model Tests", () => {
    const testUser = {
        email: "11@gmail,com", 
        name: "Test User",
        role: "user",
        firstName: "test user",
        lastName: "test user",
        password: "2",
    };

    // Test case: getAllUsers
    describe("getAllUsers", () => {
        it("should retrieve all users", async () => {
            // Retrieving all users
            const users = await adminModel.getAllUsers();
            // Assertion: Check if users is an object
            expect(users).to.be.an("object");
            // Check if the user's email is included in the retrieved users
            const sanitizedEmail = testUser.email.replace(/\./g, ",");
            expect(users).to.have.property(sanitizedEmail);
        });
    });

    // Test case: deleteUser
    describe("deleteUser", () => {
        it("should delete a user", async () => {
            // Deleting the test user
            await adminModel.deleteUser(testUser.email);
            // Retrieving all users after deletion
            const users = await adminModel.getAllUsers();
            // Check if the deleted user's email is not present in the retrieved users
            const sanitizedEmail = testUser.email.replace(/\./g, ",");
            expect(users).to.not.have.property(sanitizedEmail);
        });
    });

    // Test case: getAllUserAnalytics
    describe("getAllUserAnalytics", () => {
        it("should retrieve analytics data for all users", async () => {
            // Retrieving analytics data for all users
            const analytics = await adminModel.getAllUserAnalytics();
            // Assertion: Check if analytics is an object
            expect(analytics).to.be.an("object");
        });
    });

    // Cleanup after tests
    after(async () => {
        // Remove test user from the database
        await database.ref(`users/${testUser.email.replace(/\./g, ",")}`).remove();
    });
});
