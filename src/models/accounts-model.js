import { getDatabase, ref, get, set, remove } from "firebase/database";

// Function to sanitize email addresses by replacing dots with commas
function sanitizeEmail(email) {
  return email.replace(/\./g, ",");
}

// Model for handling account-related database operations
export const accountsModel = {
  // Method to create a new user in the database
  async createUser(user) {
    const firebaseDB = getDatabase();
    // Modify user object to include default role as "user"
    const modifiedUser = {
      ...user,
      role: "user"
    };
    // Reference to the users collection in the database
    const usersRef = ref(firebaseDB, `users/${sanitizeEmail(user.email)}`);
    // Set the user data in the database
    await set(usersRef, modifiedUser);
  },

  // Method to retrieve a user by email from the database
  async getUserByEmail(email) {
    if (!email) {
      console.error("Email is undefined in getUserByEmail");
      throw new Error("Email is undefined");
    }
    // Sanitize email for database reference
    const sanitizedEmail = sanitizeEmail(email);
    const firebaseDB = getDatabase();
    // Reference to the user document in the users collection
    const userRef = ref(firebaseDB, `users/${sanitizedEmail}`);
    // Retrieve user data from the database
    const userSnap = await get(userRef);

    // Check if user exists and return user data
    if (userSnap.exists()) {
      return userSnap.val();
    } else {
      return null;
    }
  },

  // Method to update user data in the database
  async updateUser(originalEmail, updatedData) {
    const firebaseDB = getDatabase();
    // Sanitize original email for database reference
    const originalSanitizedEmail = sanitizeEmail(originalEmail);
  
    // Reference to the original user document in the users collection
    const userRef = ref(firebaseDB, `users/${originalSanitizedEmail}`);
    const snapshot = await get(userRef);

    // Check if user exists
    if (!snapshot.exists()) {
      console.error("User not found for original email:", originalSanitizedEmail);
      throw new Error("User not found");
    }
  
    // Update user data based on provided updates
    if (updatedData.email && updatedData.email !== originalEmail) {
      // Sanitize new email for database reference
      const newSanitizedEmail = sanitizeEmail(updatedData.email);
      const newUserRef = ref(firebaseDB, `users/${newSanitizedEmail}`);
      
      // Set user data with updated email and remove the old document
      await set(newUserRef, { ...snapshot.val(), ...updatedData });
      await remove(userRef);
    } else {
      // Update user data without changing email
      await set(userRef, { ...snapshot.val(), ...updatedData });
    }
  },

  // Method to update user analytics in the database
  async updateUserAnalytics(email, newLoginData) {
    const firebaseDB = getDatabase();
    // Sanitize email for database reference
    const sanitizedEmail = sanitizeEmail(email); 
    // Reference to the user's analytics data in the users collection
    const userAnalyticsRef = ref(firebaseDB, `users/${sanitizedEmail}/analytics`);

    // Retrieve user's existing analytics data or initialize new analytics data
    const analyticsSnapshot = await get(userAnalyticsRef);
    let analytics = analyticsSnapshot.exists() ? analyticsSnapshot.val() : { loginCount: 0, logins: [] };

    // Increment login count and add new login data
    analytics.loginCount += 1;
    analytics.logins.push(newLoginData);

    // Update user analytics data in the database
    await set(userAnalyticsRef, analytics);
  },
};
