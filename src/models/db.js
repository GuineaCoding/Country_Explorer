import { userJsonStore } from "./json/user-json-store.js";
import { landmarkCategoriesJsonStore } from "./json/landmark-category-json-store.js";
import { trackJsonStore } from "./json/track-json-store.js";

export const db = {
  userStore: null,
  landmarkCategoryStore: landmarkCategoriesJsonStore,
  trackStore: null,

  init() {
    this.userStore = userJsonStore;
    this.landmarkCategoryStore = landmarkCategoriesJsonStore; 
    this.trackStore = trackJsonStore;
  },
};
