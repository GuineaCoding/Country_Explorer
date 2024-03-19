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
};
