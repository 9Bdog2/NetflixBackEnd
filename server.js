import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mediaRouter from "./src/media/index.js";

const port = process.env.PORT || 3001;

/* ------------Setting up server---------- */
const server = express();
/* ------------Setting up server---------- */
/* ------------Endpoints---------- */
server.use("/media", mediaRouter);
/* ------------Endpoints---------- */

/* ------------Setting up middlewares---------- */
server.use(cors());
server.use(express.json());
/* ------------Setting up middlewares---------- */

/* ------------ SERVER ---------- */
server.listen(port, () => {
  console.log(`Server is running on port ---${port}---`);
  console.log(listEndpoints(server));
});
/* ------------ SERVER ---------- */
