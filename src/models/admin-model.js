import { getDatabase, ref, get, remove } from "firebase/database";

// Model for handling admin-related database operations
export const adminModel = {
    // Method to retrieve all users from the database
    async getAllUsers() {
        const db = getDatabase();
        const usersRef = ref(db, "users/");
        const snapshot = await get(usersRef);
        // Check if users exist and return them
        if (snapshot.exists()) {
            return snapshot.val();
        } 
    },

    // Method to delete a user from the database
    async deleteUser(email) {
        // Sanitize email for database reference
        const sanitizedEmail = email.replace(/\./g, ",");
        const db = getDatabase();
        // Reference to the user document in the users collection
        const userRef = ref(db, `users/${sanitizedEmail}`);
        // Remove the user document from the database
        await remove(userRef);
    },

    // Method to retrieve analytics data for all users from the database
    async getAllUserAnalytics() {
        const firebaseDB = getDatabase();
        // Reference to the users collection in the database
        const usersRef = ref(firebaseDB, "users/");
        const snapshot = await get(usersRef);
      
        let analyticsData = {};
        // Extract analytics data for each user and store in analyticsData object
        if (snapshot.exists()) {
            const users = snapshot.val();
            Object.keys(users).forEach(userId => {
                if (users[userId].analytics) {
                    analyticsData[userId] = users[userId].analytics;
                }
            });
        }
        // Return the aggregated analytics data
        return analyticsData;
    }
};
