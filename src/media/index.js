import express from "express";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";
import { readMediaJSON, writeMediaJSON } from "../lib/fs-tools.js";
import createHttpError from "http-errors";
import {
  mediaValidationMiddleware,
  reviewValidationMiddleware,
} from "./validation.js";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { pipeline } from "stream";
import { getPDFReadebleStream } from "../lib/pdf-tools.js";

/* ------------Defining Router---------- */
const mediaRouter = express.Router();
/* ------------Defining Router---------- */

/* ------------Setting up endpoints---------- */
/* 
POST Media
GET Media (list) (reviews included)
GET Media (single) (with reviews)
UPDATE Media
DELETE Media
POST Poster to single media (/media/:id/poster )
Get /media/:id/reviews
POST Review to media (/media/:id/reviews)
DELETE Review of media (/media/:id/reviews/:reviewId)
/media/:id/pdf
Media
 {
        "Title": "The Lord of the Rings: The Fellowship of the Ring",
        "Year": "2001",
        "imdbID": "tt0120737",  //UNIQUE
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
}
Review 
{
        "_id": "123455", //SERVER GENERATED
        "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
        "rate": 3, //REQUIRED, max 5
        "elementId": "5d318e1a8541744830bef139", //REQUIRED = IMDBID
        "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
}

*/

mediaRouter.get("/", async (req, res, next) => {
  try {
    const media = await readMediaJSON();
    console.log(media);
    if (media) {
      res.status(200).json(media);
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.post(
  "/",
  /* mediaValidationMiddleware, */ async (req, res, next) => {
    try {
      const errorList = validationResult(req);
      if (errorList.isEmpty()) {
        const media = await readMediaJSON();
        const newMedia = {
          imdbID: uniqid(),
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          Reviews: [],
        };
        if (media) {
          media.push(newMedia);
          await writeMediaJSON(media);
          res.status(201).send(newMedia);
        } else {
          next(createHttpError(404, "No media found"));
        }
      } else {
        next(createHttpError(400, "Bad Request"));
      }
    } catch (err) {
      next(err);
    }
  }
);

mediaRouter.get("/:imdbID", async (req, res, next) => {
  try {
    const media = await readMediaJSON();
    const imdbID = req.params.imdbID;
    const mediaToSend = media.find((media) => media.imdbID === imdbID);
    if (mediaToSend) {
      res.status(200).send(mediaToSend);
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.put("/:imdbID", async (req, res, next) => {
  try {
    const media = await readMediaJSON();
    const imdbID = req.params.imdbID;
    const mediaToUpdate = media.find((media) => media.imdbID === imdbID);
    if (mediaToUpdate) {
      const updatedMedia = {
        ...mediaToUpdate,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      media.splice(media.indexOf(mediaToUpdate), 1, updatedMedia);
      await writeMediaJSON(media);
      res.status(200).send(updatedMedia);
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.delete("/:imdbID", async (req, res, next) => {
  try {
    const media = await readMediaJSON();
    const imdbID = req.params.imdbID;
    const mediaToDelete = media.find((media) => media.imdbID === imdbID);
    if (mediaToDelete) {
      media.splice(media.indexOf(mediaToDelete), 1);
      await writeMediaJSON(media);
      res.status(200).send(mediaToDelete);
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.get("/:imdbID/reviews", async (req, res, next) => {
  try {
    const media = await readMediaJSON();
    const imdbID = req.params.imdbID;
    const mediaToSend = media.find((media) => media.imdbID === imdbID);
    if (mediaToSend) {
      res.status(200).send(mediaToSend.Reviews);
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});

const cloudUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "netflix_media",
    },
  }),
}).single("poster");

mediaRouter.post("/:imdbID/poster", cloudUploader, async (req, res, next) => {
  try {
    const media = await readMediaJSON();
    const imdbID = req.params.imdbID;
    const mediaToUpdate = media.find((media) => media.imdbID === imdbID);
    if (mediaToUpdate) {
      const updatedMedia = {
        ...mediaToUpdate,
        Poster: req.file.path,
        updatedAt: new Date().toISOString(),
      };
      media.splice(media.indexOf(mediaToUpdate), 1, updatedMedia);
      await writeMediaJSON(media);
      res.status(200).send(updatedMedia);
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.get("/:imdbID/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=media.pdf");
    const media = await readMediaJSON();
    const imdbID = req.params.imdbID;
    const mediaToSend = media.find((media) => media.imdbID === imdbID);
    if (mediaToSend) {
      const source = getPDFReadebleStream(mediaToSend);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) {
          next(err);
        }
      });
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.get("/:imdbID/reviews/:elementId", async (req, res, next) => {
  try {
    const media = await readMediaJSON();
    const imdbID = req.params.imdbID;
    const mediaToSend = media.find((media) => media.imdbID === imdbID);
    if (mediaToSend) {
      const reviews = mediaToSend.Reviews.filter(
        (review) => review._id === req.params.elementId
      );

      res.status(200).send(reviews);
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});
mediaRouter.delete("/:imdbID/reviews/:elementId", async (req, res, next) => {
  try {
    const media = await readMediaJSON();
    const imdbID = req.params.imdbID;
    const mediaToSend = media.find((media) => media.imdbID === imdbID);
    if (mediaToSend) {
      const reviews = mediaToSend.Reviews.filter(
        (review) => review._id === req.params.elementId
      );
      if (reviews.length > 0) {
        mediaToSend.Reviews.splice(mediaToSend.Reviews.indexOf(reviews[0]), 1);
        await writeMediaJSON(media);
        res.status(200).send("COMMENT DELETED", reviews._id);
      } else {
        next(createHttpError(404, "No media found"));
      }
    } else {
      next(createHttpError(404, "No media found"));
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.post(
  "/:imdbID/reviews",
  reviewValidationMiddleware,
  async (req, res, next) => {
    try {
      const media = await readMediaJSON();
      const imdbID = req.params.imdbID;
      const mediaToSend = media.find((media) => media.imdbID === imdbID);
      if (mediaToSend) {
        const newReview = {
          _id: uniqid(),
          comment: req.body.comment,
          rate: req.body.rate,
          elementId: imdbID,
          createdAt: new Date().toISOString(),
        };
        mediaToSend.Reviews.push(newReview);
        await writeMediaJSON(media);
        res.status(201).send(newReview);
      } else {
        next(createHttpError(404, "No media found"));
      }
    } catch (err) {
      next(err);
    }
  }
);

export default mediaRouter;
/* ------------Setting up endpoints---------- */
