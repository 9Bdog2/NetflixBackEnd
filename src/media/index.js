import express from "express";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import  uniqid  from "uniqid";
import {
    readMediaJSON,
  writeMediaJSON,
} from "../lib/fs-tools.js";
import createHttpError from "http-errors";
import {
  mediaValidationMiddleware,
  reviewValidationMiddleware,
} from "./validation.js";
import { validationResult } from "express-validator";

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
  } catch (err) {
    next(err);
  }
});

mediaRouter.post("/", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

mediaRouter.get("/:imdbID", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

mediaRouter.put("/:imdbID", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

mediaRouter.delete("/:imdbID", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

mediaRouter.get("/:imdbID/reviews", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

mediaRouter.post("/:imdbID/poster", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

mediaRouter.get("/:imdbID/pdf", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

mediaRouter.get("/:imdbID/reviews/:elementId", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});
mediaRouter.delete("/:imdbID/reviews/:elementId", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

mediaRouter.post("/:imdbID/reviews", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

export default mediaRouter;
/* ------------Setting up endpoints---------- */
