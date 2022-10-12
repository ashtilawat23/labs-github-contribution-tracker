import { Router } from "express";

const baseRouter = Router();

baseRouter.get("/", function (req, res) {
  res.send("Hi!");
});

export default baseRouter;