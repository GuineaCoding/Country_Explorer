import { v4 } from "uuid";

let landmarks = [];

export const landmarkMemStore = {
  async getAllLandmarks() {
    return landmarks;
  },

  async addLandmark(Landmark) {
    Landmark._id = v4();
    landmarks.push(Landmark);
    return Landmark;
  },

  async getLandmarkById(id) {
    return landmarks.find((Landmark) => Landmark._id === id);
  },

  async deleteLandmarkById(id) {
    const index = landmarks.findIndex((Landmark) => Landmark._id === id);
    landmarks.splice(index, 1);
  },

  async deleteAllLandmarks() {
    landmarks = [];
  },
};
