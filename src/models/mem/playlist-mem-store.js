import { v4 } from "uuid";
import { trackMemStore } from "./track-mem-store.js";

let landmarkCategories = [];

export const playlistMemStore = {
  async getAllPlaylists() {
    return landmarkCategories;
  },

  async addLandMarkCategory(landmarkCategory) {
    landmarkCategory._id = v4();
    landmarkCategories.push(landmarkCategory);
    return landmarkCategory;
  },

  async getLandmarkCategoryById(id) {
    const list = landmarkCategories.find((landmarkCategory) => landmarkCategory._id === id);
    list.tracks = await trackMemStore.getLandmarksByLandmarkCategoryId(list._id);
    return list;
  },

  async getUserLandmarkCategories(userid) {
    return landmarkCategories.filter((landmarkCategory) => landmarkCategory.userid === userid);
  },

  async deleteLandmarkCategoryById(id) {
    const index = landmarkCategories.findIndex((landmarkCategory) => landmarkCategory._id === id);
    landmarkCategories.splice(index, 1);
  },

  async deleteAllLandmarkCategories() {
    landmarkCategories = [];
  },
};
