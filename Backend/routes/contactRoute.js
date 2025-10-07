import express from "express";
import { FormContact } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/", FormContact);

export default contactRouter;
