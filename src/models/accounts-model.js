import { getDatabase, ref, get, set } from "firebase/database";

export const accountsModel = {
  async createUser(user) {
    const firebaseDB = getDatabase();
    const usersRef = ref(firebaseDB, `users/${user.email.replace(/\./g, ",")}`);
    await set(usersRef, user);
  },

  async getUserByEmail(email) {
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
  async updateUser(userEmail, updateData) {
    const firebaseDB = getDatabase();
    const sanitizedEmail = userEmail.replace(/\./g, ",");
    const userRef = ref(firebaseDB, `users/${sanitizedEmail}`);
  
    // Check if the user exists
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error('User not found');
    }
  
    // Update only the necessary fields
    await set(userRef, {
      ...snapshot.val(),
      ...updateData
    });
  }
};
