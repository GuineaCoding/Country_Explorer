import { userMemStore } from "./mem/user-mem-store.js";
import { landmarkMemStore } from "./mem/landmark-mem-store.js";

export const db = {
  userStore: null,
  landmarkStore: null, 

  init() {
    this.userStore = userMemStore;
    this.landmarkStore = landmarkMemStore; 
  },
};
