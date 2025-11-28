import express from "express";
import { createLink, listLinks, getLink, deleteLink } from "../controllers/linkController.js";

const router = express.Router();

// create new short link
router.post("/", createLink);

// list all links
router.get("/", listLinks);

// get link by code
router.get("/:code", getLink);

// delete link by code
router.delete("/:code", deleteLink);

export default router;
