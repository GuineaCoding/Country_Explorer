import { getDatabase, ref, get, set, remove } from "firebase/database";

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
    // Ensure email is not undefined or null
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
      console.error('User not found for original email:', originalSanitizedEmail);
      throw new Error('User not found');
    }
  
    // If the email has been updated, handle the email update process
    if (updatedData.email && updatedData.email !== originalEmail) {
      const newSanitizedEmail = updatedData.email.replace(/\./g, ",");
      const newUserRef = ref(firebaseDB, `users/${newSanitizedEmail}`);
      
      // Create new record with updated email and remove the old record
      await set(newUserRef, { ...snapshot.val(), ...updatedData });
      await remove(userRef);
    } else {
      // If email hasn't changed, just update the existing record
      await set(userRef, { ...snapshot.val(), ...updatedData });
    }
  }  
};
