import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { trackJsonStore } from "./track-json-store.js";

export const landmarkCategoriesJsonStore = {
  async getAllLandmarkCategoriesJsonStore() {
    await db.read();
    return db.data.landmarkCategories;
  },

  async addLandMarkCategory(landmarkCategory) {
    await db.read();
    landmarkCategory._id = v4();
    db.data.landmarkCategories.push(landmarkCategory);
    await db.write();
    return landmarkCategory;
  },

  async getLandmarkCategoryById(id) {
    await db.read();
    const list = db.data.landmarkCategories.find((landmarkCategory) => landmarkCategory._id === id);
    list.tracks = await trackJsonStore.getLandmarksByLandmarkCategoryId(list._id);
    return list;
  },

  async getUserLandmarkCategories(userid) {
    await db.read();
    return db.data.landmarkCategories.filter((landmarkCategory) => landmarkCategory.userid === userid);
  },

  async deleteLandmarkCategoryById(id) {
    await db.read();
    const index = db.data.landmarkCategories.findIndex((landmarkCategory) => landmarkCategory._id === id);
    db.data.landmarkCategories.splice(index, 1);
    await db.write();
  },

  async deleteAllLandmarkCategories() {
    db.data.landmarkCategories = [];
    await db.write();
  },
};
