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
  }
};
