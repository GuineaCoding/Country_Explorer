import { getDatabase, ref, get, remove } from "firebase/database";

export const adminModel = {
    async getAllUsers() {
        const db = getDatabase();
        const usersRef = ref(db, "users/");
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return {};
        }
    },

    async deleteUser(email) {
        const sanitizedEmail = email.replace(/\./g, ",");
        const db = getDatabase();
        const userRef = ref(db, `users/${sanitizedEmail}`);
        await remove(userRef);
    },
    async getAllUserAnalytics() {
        const firebaseDB = getDatabase();
        const usersRef = ref(firebaseDB, `users/`);
        const snapshot = await get(usersRef);
      
        let analyticsData = {};
        if (snapshot.exists()) {
          const users = snapshot.val();
          Object.keys(users).forEach(userId => {
            if (users[userId].analytics) {
              analyticsData[userId] = users[userId].analytics;
            }
          });
        }
        return analyticsData;
      }
};
