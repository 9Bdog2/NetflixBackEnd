import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import {
  genericErrorHandler,
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import mediaRouter from "./src/media/index.js";

const port = process.env.PORT || 3001;

/* ------------Setting up server---------- */
const server = express();
/* ------------Setting up server---------- */

/* ------------Whitelist and CorsOption---------- */
const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

/* ------------Whitelist and CorsOption---------- */

/* ------------Setting up middlewares---------- */
server.use(cors(corsOptions));
server.use(express.json());
/* ------------Setting up middlewares---------- */

/* ------------Endpoints---------- */
server.use("/media", mediaRouter);
/* ------------Endpoints---------- */
/* ------------Generic Error Handlers---------- */
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
/* ------------Generic Error Handlers---------- */
/* ------------ SERVER ---------- */
server.listen(port, () => {
  console.log(`Server is running on port ---${port}---`);
  console.log(listEndpoints(server));
});
/* ------------ SERVER ---------- */
