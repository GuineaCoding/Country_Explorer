import { getDatabase, ref, get, set, remove } from "firebase/database";

function sanitizeEmail(email) {
  return email.replace(/\./g, ",");
}

export const accountsModel = {
  async createUser(user) {
    const firebaseDB = getDatabase();
    const modifiedUser = {
      ...user,
      role: 'user'
    };
    const usersRef = ref(firebaseDB, `users/${user.email.replace(/\./g, ",")}`);
    await set(usersRef, modifiedUser);
  },

  async getUserByEmail(email) {
    if (!email) {
      console.error("Email is undefined in getUserByEmail");
      throw new Error("Email is undefined");
    }
    const sanitizedEmail = email.replace(/\./g, ",");
    const firebaseDB = getDatabase();
    const userRef = ref(firebaseDB, `users/${sanitizedEmail}`);
    const userSnap = await get(userRef);

    if (userSnap.exists()) {
      return userSnap.val();
    } else {
      return null;
    }
  },

  async updateUser(originalEmail, updatedData) {
    const firebaseDB = getDatabase();
    const originalSanitizedEmail = originalEmail.replace(/\./g, ",");
  
    const userRef = ref(firebaseDB, `users/${originalSanitizedEmail}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      console.error("User not found for original email:", originalSanitizedEmail);
      throw new Error("User not found");
    }
  
    if (updatedData.email && updatedData.email !== originalEmail) {
      const newSanitizedEmail = updatedData.email.replace(/\./g, ",");
      const newUserRef = ref(firebaseDB, `users/${newSanitizedEmail}`);
      
      await set(newUserRef, { ...snapshot.val(), ...updatedData });
      await remove(userRef);
    } else {
      await set(userRef, { ...snapshot.val(), ...updatedData });
    }
  },
  async updateUserAnalytics(email, newLoginData) {
    const firebaseDB = getDatabase();
    const sanitizedEmail = sanitizeEmail(email); 
    const userAnalyticsRef = ref(firebaseDB, `users/${sanitizedEmail}/analytics`);

   
    const analyticsSnapshot = await get(userAnalyticsRef);
    let analytics = analyticsSnapshot.exists() ? analyticsSnapshot.val() : { loginCount: 0, logins: [] };

    analytics.loginCount += 1;
    analytics.logins.push(newLoginData);


    await set(userAnalyticsRef, analytics);
  },
};
