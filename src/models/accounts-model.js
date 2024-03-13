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
  
    let updatedUserRef = userRef;
    if (updatedData.email && updatedData.email !== originalEmail) {
      const newSanitizedEmail = updatedData.email.replace(/\./g, ",");
      updatedUserRef = ref(firebaseDB, `users/${newSanitizedEmail}`);
    }
  
    await set(updatedUserRef, { ...snapshot.val(), ...updatedData });
  
    if (updatedData.email && updatedData.email !== originalEmail) {
      await remove(userRef);
    }
  }
  

};
