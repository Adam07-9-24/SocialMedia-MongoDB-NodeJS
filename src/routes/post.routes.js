import express from "express";
import postController from "../controllers/postController.js";

const router = express.Router();

router.get("/", postController.getAll);
router.get("/new", postController.showNew);
router.post("/", postController.create);
router.get("/:id/edit", postController.showEdit);
router.post("/:id/edit", postController.update);
router.post("/:id/delete", postController.delete);

export default router;
