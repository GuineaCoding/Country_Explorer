import { LandmarkSpec } from "../models/joi-schemas.js";
import { landmarkModel } from "../models/landmark-model.js"; 
import admin from "firebase-admin";


async function uploadPhotoToFirebase(file) {
  const bucket = admin.storage().bucket();
  const fileName = `landmarks/${Date.now()}-${file.hapi.filename}`;
  const fileUpload = bucket.file(fileName);

  await new Promise((resolve, reject) => {
    const fileStream = file.pipe(fileUpload.createWriteStream({
      metadata: {
        contentType: file.hapi.headers['content-type'],
      }
    }));

    fileStream.on('error', (err) => reject(err));
    fileStream.on('finish', () => resolve());
  });

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

export const landmarkCategoryController = {
  index: {
    handler: async function (request, h) {
      const categoryId = request.params.id;
      const userEmail = request.auth.credentials.email.replace(/\./g, ",");
      try {
        const landmarkCategory = await landmarkModel.getLandmarkCategory(userEmail, categoryId);
        if (!landmarkCategory) {
          return h.response("Not Found").code(404);
        }
        return h.view("landmarkCategory-view", {
          title: "Landmark Category",
          landmarkCategory: landmarkCategory,
        });
      } catch (error) {
        console.error("Error in index handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    },
  },

  addLandmark: {
    handler: async function (request, h) {
      const categoryId = request.params.id;
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      const payload = request.payload;
  
      let imageUrl = '';
      if (payload.file) {
        imageUrl = await uploadPhotoToFirebase(payload.file);
      }
  
      const newLandmark = {
        landmarkTitle: payload.landmarkTitle,
        description: payload.description,
        latitude: Number(payload.latitude),
        longitude: Number(payload.longitude),
        imageUrl: imageUrl
      };
  
      try {
        await landmarkModel.addLandmark(userEmail, categoryId, newLandmark);
        return h.redirect(`/landmarkCategory/${categoryId}`);
      } catch (error) {
        console.error("Error in addLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    }
  },

  deleteLandmark: {
    handler: async function (request, h) {
      const categoryId = request.params.id;
      const landmarkId = request.params.landmarkId;
      const userEmail = request.auth.credentials.email.replace(/\./g, ',');
      try {
        await landmarkModel.deleteLandmark(userEmail, categoryId, landmarkId);
        return h.redirect(`/landmarkCategory/${categoryId}`);
      } catch (error) {
        console.error("Error in deleteLandmark handler:", error);
        return h.response("An internal server error occurred").code(500);
      }
    }
  },
};
