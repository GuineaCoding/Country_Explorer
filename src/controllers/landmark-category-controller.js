import { TrackSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const landmarkCategoryController = {
  index: {
    handler: async function (request, h) {
      const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
      const viewData = {
        title: "Landmark Category",
        landmarkCategory: landmarkCategory,
      };
      return h.view("landmarkCategory-view", viewData);
    },
  },

  addTrack: {
    validate: {
      payload: TrackSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
        return h.view("landmarkCategory-view", { title: "Add track error", landmarkCategory:currentLandmarkCategory, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
      const newTrack = {
        title: request.payload.title,
        artist: request.payload.artist,
        duration: Number(request.payload.duration),
      };
      await db.trackStore.addTrack(landmarkCategory._id, newTrack);
      return h.redirect(`/landmarkCategory/${landmarkCategory._id}`);
    },
  },

  deleteTrack: {
    handler: async function (request, h) {
      const landmarkCategory = await db.landmarkCategoryStore.getLandmarkCategoryById(request.params.id);
      await db.trackStore.deleteTrack(request.params.trackid);
      return h.redirect(`/landmarkCategory/${landmarkCategory._id}`);
    },
  },
};
