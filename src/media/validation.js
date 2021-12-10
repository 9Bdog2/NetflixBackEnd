import { body } from "express-validator";

export const mediaValidationMiddleware = [
  body("title").exists().withMessage("Title is required"),
  body("year").exists().withMessage("Year is required"),
  body("Type").exists().withMessage("Type is required"),
  body("poster").exists().withMessage("Poster is required"),
];

export const reviewValidationMiddleware = [
  body("comment").exists().withMessage("Comment is required"),
  body("rate").exists().withMessage("Rating is required"),
  body("elementId").exists().withMessage("IMDBID is required"),
];
